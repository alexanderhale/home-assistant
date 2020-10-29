# home-assistant
[Home Assistant](https://www.home-assistant.io/) installation on a Google Nexus 7 tablet. A similar setup process can be followed for any Android device.

## Background
I print out a hard copy of the New York Times crossword puzzle quite regularly. Realizing that the steps to navigate to the puzzle and print it out were the same each time, my first thought was to to create an automation with Google Assistant and IFTTT. Unfortunately, the process is too complex for those tools: the URL of the crossword changes each day, the puzzle needs to be downloaded from that URL, then the downloaded puzzle needs to be sent to my printer.

Further research pointed me toward [Home Assistant](https://www.home-assistant.io), which has all the tools needed for this task. In addition, Home Assistant is extensible: it requires much more setup than IFTTT, but once set up, it is ready for all sorts of automations which I haven't even thought of yet.

The Home Assistant installation guide recommends using a Raspberry Pi to run the automation server. I had a Google Nexus 7 tablet lying around, so I set out to make use of it instead of buying a new device. An additional benefit is that the tablet can be used as a wall-mounted UI for Home Assistant - this is something you can do regardless of where the Home Assistant server is hosted, but this setup allows the server and UI to be run on one device.

## Prerequisites
- hardware: Google Nexus 7 (2013) tablet
- software: Android 5.0.0
- tools: a computer, and a micro USB cable to connect the tablet to the computer
- peripherals: a Google Home Mini, and a smart plug (peripherals are not required for Home Assistant setup, but most automations you'll want to create will require a peripheral)


## Lineage OS Installation
The Nexus 7 tablet stopped receiving software updates as of Android 5 (Lollipop). This version of Android causes lots of incompatibilities, where the most recent version of software no longer supports such an old version of Android. In addition, the tablet I had was running quite slowly - it was bogged down with old files and apps, and the dated operating system likely wasn't helping in terms of speed.

To resolve these issues, I chose to install Lineage OS on the tablet. The latest version at the time of writing is Lineage OS 17.1 (which equates to Android 10). If you want to stick with Android, it may also be possible to install newer versions of Android with similar steps to the ones documented here.

Let's dive into the steps required to install Lineage OS on the tablet.

### Backup Files
If you have anything you care about on your Nexus 7 (files, configuration, etc), back it up to another location now. The tablet will be factory reset during the operating system re-install.

### Download Files
These files will be required for the Lineage OS installation:
- [Team Win Recovery Project (TWRP)](https://dl.twrp.me/flo/twrp-3.4.0-0-flo.img)
    - The link is to version 3.4.0, but you can select whatever the latest version is.
- [Lineage OS 17.1](https://lineageos.wickenberg.nu/flo)
    - Navigate to Google > flo, then select the most recent build for version 17.1.
- [addonsu 17.1](./tablet_setup/lineage_os/addonsu-17.1-arm.zip)
    - Saved in this repository in case [the source](https://androidfilehost.com/?fid=8889791610682882454) is no longer available.
- [sysrepart.zip](./tablet_setup/lineage_os/sysrepart.zip)
    - Saved in this repository in case [the source](https://forum.xda-developers.com/showpost.php?p=76278047&postcount=19) is no longer available.
- [GApps](https://opengapps.org/) (optional)
    - select ARM, Android 10.0, nano size

### Install TWRP
TWRP is a custom recovery tool. We'll replace the default system recovery tools on the device with TWRP. This will make it easier to swap the OS on our device.

This can be accomplished using the TWRP app, or by connecting the tablet to a computer and using the Android Debug Bridge (ADB). This guide will use ADB - see [this TWRP installation guide](https://www.xda-developers.com/how-to-install-twrp/) for more details on both options.

#### Step 1 - Enable USB Debugging
Permission is required to connect the tablet to the computer. On the tablet, enable developer options by finding the "About" section in the settings, then repeatedly tapping the build number section. Enter the developer options menu, then toggle `USB debugging` to on. You can use wireless ADB debugging if you prefer, but file transfers will likely be slower.

#### Step 2 - ADB and Fastboot
Install ADB and fastboot on your computer. The Lineage OS wiki has an [article on how to do this](https://wiki.lineageos.org/adb_fastboot_guide.html) for various operating systems. Once installed, connect the tablet to the computer, then approve the permissions pop-up that appears on the tablet screen. To confirm that the tablet is accessible via ADB, open a terminal and run `adb devices`. Make sure that the tablet appears in the list as a device. 

#### Step 3 - Flash TWRP Image
Run `adb reboot bootloader` in a terminal on the computer. Wait for the device to boot into bootloader mode, then run `fastboot flash recovery <twrp-img-file>`, replacing `<twrp-img-file>` with the path to the TWRP file that you downloaded earlier. Once the flash is complete, run `fastboot reboot`.

Success! TWRP should now be installed. To check that the installation was successful, power off the tablet, then reboot into recovery mode by holding the power and volume down buttons at the same time until the recovery mode screen appears. 

TODO insert android recovery mode screenshot.

Use the volume buttons to scroll to the `Recovery` option, then press the power button to select it. The TWRP menu should appear.

TODO insert TWRP screenshot.

### Install LineageOS
#### Step 1 - Factory Reset
Confirm that you've backed up everything that was saved on the device. Then, starting from the TWRP home page, navigate to Wipe > Factory Reset, and perform the reset. 

#### Step 2 - Repartition
The existing partitioning of the device leaves little space for loading the OS and GApps images that we'll be installing in the next step. To check the amount of space, start from the TWRP home page, then navigate to Wipe > Advanced Wipe > System > Repair or Change File System. Take note of the free space listed on the left-hand side of the screen.

Return to the TWRP home screen, then navigate to Install > ADB Sideload. Once the sideload is ready, open a terminal on the computer and run `adb sideload sysrepart.zip`. Confirm on the tablet that the image gets flashed successfully.

Return to Repair or Change File System and check the free space - it should have increased.

#### Step 3 - Flash New OS
The following files must be loaded in the order listed here. If you don't need the Google Play store on your device, then feel free to skip the GApps step.

From the TWRP home screen, navigate to Install > ADB Sideload. Once the sideload is ready, open a terminal on your computer and run `adb sideload <lineage_os_filename>.zip`. Confirm on the tablet that the image gets flashed successfully.

_Without_ rebooting, select ADB Sideload again, and flash `addonsu-17.1-arm.zip` in the same way. If you want to install Google Play, select ADB Sideload again, and flash the GApps zip. If the GApps flash fails due to a lack of space in the partition, try again using the `pico` size when creating the download from the GApps website. 

Once the images are flashed, select Clear Cache/Davlik, then select Reboot. The tablet should boot into a fresh installation of Lineage OS.

For more information, here are a few threads describing this process:
- [XDA-Developers Forum](https://forum.xda-developers.com/nexus-7-2013/development/rom-lineageos-17-1-t4038425)
- [Reddit thread](https://www.reddit.com/r/Nexus7/comments/esy39y/install_android_9_lineage_os_160_on_nexus_7_2013/)

## Home Assistant Installation
TODO

## Addressing Setup
TODO

### Static IP Address
TODO

### Port Forwarding
TODO

### DNS Routing
TODO

### SSL Certificate
TODO

### Reverse Proxy
TODO

### Remote SSH Access
TODO

### Startup at Reboot
TODO

## Node-RED Installation
TODO

## Google Assistant integration with Home Assistant
TODO