// build/after-sign.js

const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");

const DEV_ID = "Developer ID Application: Ontology Foundation Ltd (29B4VVVVKM)";
const ENTITLEMENTS = "build/entitlements.mac.plist";

function run(cmd) {
  console.log(`\n> ${cmd}`);
  execSync(cmd, { stdio: "inherit" });
}

exports.default = async function afterSign(context) {

  
  if (context.electronPlatformName !== "darwin") {
    console.log("!Skipping afterSign: not macOS build.");
    return;
  }
  if (process.env.CI !== 'true' || process.env.GITHUB_ACTIONS!=='true') {
    return
  }

  const appPath = path.join(
    context.appOutDir,
    `${context.packager.appInfo.productFilename}.app`
  );
  if (!fs.existsSync(appPath)) {
    console.error("!!App not found:", appPath);
    return;
  }

  console.log(`\nStarting manual signing for: ${appPath}`);

  console.log("[1/6] Signing Electron Framework Libraries...");
  const libsPath = path.join(
    appPath,
    "Contents/Frameworks/Electron Framework.framework/Versions/A/Libraries"
  );
  if (fs.existsSync(libsPath)) {
    const libs = fs.readdirSync(libsPath).filter((f) => f.endsWith(".dylib"));
    for (const lib of libs) {
      const libPath = path.join(libsPath, lib);
      run(
        `codesign -fs "${DEV_ID}" --options runtime --timestamp -v "${libPath}"`
      );
    }
  }

  console.log("[2/6] Signing Binaries of Helpers and Squirrel...");
  const crashpadHandler = path.join(
    appPath,
    "Contents/Frameworks/Electron Framework.framework/Versions/A/Helpers/chrome_crashpad_handler"
  );
  const shipIt = path.join(
    appPath,
    "Contents/Frameworks/Squirrel.framework/Versions/A/Resources/ShipIt"
  );
  if (fs.existsSync(crashpadHandler))
    run(
      `codesign -fs "${DEV_ID}" --options runtime --timestamp -v "${crashpadHandler}"`
    );
  if (fs.existsSync(shipIt))
    run(
      `codesign -fs "${DEV_ID}" --options runtime --timestamp -v "${shipIt}"`
    );

  console.log("[3/6] Signing Frameworks...");
  const frameworks = [
    "Electron Framework.framework",
    "Squirrel.framework",
    "Mantle.framework",
    "ReactiveObjC.framework",
  ];
  for (const fw of frameworks) {
    const fwPath = path.join(appPath, "Contents/Frameworks", fw);
    if (fs.existsSync(fwPath)) {
      run(
        `codesign -fs "${DEV_ID}" --options runtime --timestamp -v "${fwPath}"`
      );
    }
  }

  console.log("[4/6] Signing Helper Apps...");
  const helpers = [
    "OWallet Helper.app",
    "OWallet Helper (Renderer).app",
    "OWallet Helper (Plugin).app",
    "OWallet Helper (GPU).app",
  ];
  for (const helper of helpers) {
    const helperPath = path.join(appPath, "Contents/Frameworks", helper);
    if (fs.existsSync(helperPath)) {
      console.log(`Signing executables in ${helperPath}`);
      const helperExePath = path.join(helperPath, "Contents/MacOS");
      const exes = fs.existsSync(helperExePath)
        ? fs.readdirSync(helperExePath)
        : [];
      for (const exe of exes) {
        run(
          `codesign -fs "${DEV_ID}" --options runtime --timestamp -v "${path.join(
            helperExePath,
            exe
          )}"`
        );
      }
      console.log(`Signing helper app itself ${helperPath}`);
      run(
        `codesign -fs "${DEV_ID}" --options runtime --timestamp --deep --entitlements ${ENTITLEMENTS} -v "${helperPath}"`
      );
    }
  }

  console.log("[5/6] Signing Main Binary...");
  const mainExePath = path.join(appPath, "Contents/MacOS/OWallet");
  if (fs.existsSync(mainExePath)) {
    run(
      `codesign -fs "${DEV_ID}" --options runtime --timestamp --deep -v --entitlements ${ENTITLEMENTS} "${mainExePath}"`
    );
  }

  console.log("[6/6] Signing .app...");
  run(
    `codesign -fs "${DEV_ID}" --options runtime --timestamp --deep --entitlements ${ENTITLEMENTS} -v "${appPath}"`
  );

  console.log("\nVerifying Signature...");
  run(`codesign -vvv --deep --strict "${appPath}"`);
  run(`codesign -dvv "${appPath}"`);

  console.log("\nManual signing completed successfully!");

  console.log("\nSubmitting to Apple for notarization...");

  const ZIP_FILE = path.join(
    context.appOutDir,
    `${context.packager.appInfo.productFilename}.zip`
  );
  run(`ditto -c -k --keepParent "${appPath}" "${ZIP_FILE}"`);
  run(
    `xcrun notarytool submit --apple-id ${process.env.APPLE_ID} --team-id ${process.env.TEAM_ID} --password ${process.env.PASSWORD}  --wait  "${ZIP_FILE}"`
  );
  console.log("Notarization complete.");

  run(`xcrun stapler staple "${appPath}"`);
  console.log("\nSigning & notarization finished successfully!");
};
