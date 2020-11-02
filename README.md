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


## LineageOS Installation
The Nexus 7 tablet stopped receiving software updates as of Android 5 (Lollipop). This version of Android causes lots of incompatibilities, where the most recent version of software no longer supports such an old version of Android. In addition, the tablet I had was running quite slowly - it was bogged down with old files and apps, and the dated operating system likely wasn't helping in terms of speed.

To resolve these issues, I chose to install LineageOS on the tablet. The latest version at the time of writing is LineageOS 17.1 (which equates to Android 10). If you want to stick with Android, it may also be possible to install newer versions of Android with similar steps to the ones documented here.

Let's dive into the steps required to install LineageOS on the tablet.

### Backup Files
If you have anything you care about on your Nexus 7 (files, configuration, etc), back it up to another location now. The tablet will be factory reset during the operating system re-install.

### Download Files
These files will be required for the LineageOS installation:
- [Team Win Recovery Project (TWRP)](https://dl.twrp.me/flo/twrp-3.4.0-0-flo.img)
    - The link is to version 3.4.0, but you can select whatever the latest version is.
- [LineageOS 17.1](https://lineageos.wickenberg.nu/flo)
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
Install ADB and fastboot on your computer. The LineageOS wiki has an [article on how to do this](https://wiki.lineageos.org/adb_fastboot_guide.html) for various operating systems. Once installed, connect the tablet to the computer, then approve the permissions pop-up that appears on the tablet screen. To confirm that the tablet is accessible via ADB, open a terminal and run `adb devices`. Make sure that the tablet appears in the list as a device. 

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

Once the images are flashed, select Clear Cache/Davlik, then select Reboot. The tablet should boot into a fresh installation of LineageOS.

For more information, here are a few threads describing this process:
- [XDA-Developers Forum](https://forum.xda-developers.com/nexus-7-2013/development/rom-lineageos-17-1-t4038425)
- [Reddit thread](https://www.reddit.com/r/Nexus7/comments/esy39y/install_android_9_lineage_os_160_on_nexus_7_2013/)

## Home Assistant Installation
Now that the operating system on the tablet has been swapped from Android to LineageOS, Home Assistant (and related programs) can be installed.

### Install F-Droid
[F-Droid](https://www.f-droid.org/) is a repository for free apps, analogous to the Google Play store. Head to F-Droid's website and download the latest .apk file. Once downloaded, a pop-up will appear - hit `Install`.

If you included GApps in your LineageOS installation, you could skip F-Droid and get Termux (in then next step) from the Google Play store instead. At the time of writing, some of the Termux add-ons are paid in Google Play (but free in F-Droid). You could even install Termux directly from source, if you wanted to avoid repositoiries completely - but this guide will assume that Termux will be downloaded from an app repository.

### Install Termux
Most of the Home Assistant installation work will be done on the command line. The most robust UNIX console emulator for Android is Termux. To get Termux, head to F-Droid or Google Play. Search for [Termux](https://f-droid.org/en/packages/com.termux), download it, and install it. While you're here, download and install [Termux:API](https://f-droid.org/en/packages/com.termux.api/) and [Termux:Boot](https://f-droid.org/en/packages/com.termux.boot) as well - we'll need them later.

Since Termux is a command-line, some typing is required, which is not the most conducive to a tablet touch-screen. If you have one, connecting a Bluetooth keyboard would be helpful. If not, you could try a modified on-screen keyboard like [Hacker's Keyboard](https://f-droid.org/en/packages/org.pocketworkstation.pckeyboard/). Before the configuration section later on, we'll connect to the tablet via SSH, so that you can use your computer for the heavier typing required in that section.

### Install Packages
Open up the Termux app. Look around a little bit - notice that your home directory is `/data/data/com.termux/files/home/`, and the `etc` directory (where packages will be installed) is at `/data/data/com.termux/files/usr/etc/`. This is different than a standard UNIX operating system.

The package manager in Termux is `pkg`, which is a wrapper around `apt`. You can also use the `apt` command directly, but there's usually no need to do so.

Here are the packages to install at this stage:
`python`: Home Assistant runs in Python, so the language needs to be installed
`nano`: for viewing and editing files
`openssh`: TODO
`termux-api`: to connect with the Termux:API app that is installed on the device
`make`: to allow Makefiles to run
`libjpeg-turbo`: to avoid a bug in a later step due to a missing JPEG package

Install the necessary packages with these commands (confirming with `y` when requested):
```bash
pkg updates
pkg upgrade
pkg install python nano openssh termux-api make libjpeg-turbo
```

### Install Home Assistant
The prerequisites are now in place to install Home Assistant. Home Assistant Core is a Python package, available from the PyPi package repository. Here are the commands to run to install it:
```bash
# create a virtual environment (optional, but recommended)
python -m venv hass
source hass/bin/activate

pip install homeassistant
```

The virtual environment is optional - if you don't use one, `pip install homeassistant` will install the Home Assistant packages in your "base" environment. However, using a virtual environment makes your installation isolated - if you want to update your version of Python or Home Assistant, you could do so in a fresh virtual environment to make sure everything is working properly without impacting your existing installation.

### Run
Everything is now in place! With your virtual environment activated, execute `hass -v`. During this first startup, keep an eye on the output for error messages, which might indicate that something has been configured incorrectly.

If the startup succeeds, head to `localhost:8123` in a browser on the tablet - the Home Assistant homepage should appear!

For more information, here is a Medium post describing this process:
- https://lucacesarano.medium.com/install-home-assistant-hass-on-android-no-root-fb65b2341126

## Addressing Setup
Home Assistant is now running on the Nexus 7 tablet, and it is accessible from other devices which are also connected to your home network. To access Home Assistant from another device, find your tablet's network IP address (something like `192.168.2.xx`) by running the `ipconfig` command, or by logging in to your router's admin console (usually at `192.168.2.1`) and finding your tablet in the list of devices. Then, navigate to that address from another device using port 8123: `http://192.168.2.xx:8123`. The Home Assistant interface should load, the same way it does for `localhost:8123` on your tablet.

This setup works fine for basic usage, but it lacks robustness. What if your router re-assigns your tablet a new IP address? What if you want to access your Home Assistant setup when you're away from home? What if you want to connect Home Assistant to an external provider like Google Assistant? These are the types of hurdles that will be addressed in this section.

### Static IP Address
By default, your tablet gets assigned an IP address by your router in a process called [DHCP](https://en.wikipedia.org/wiki/Dynamic_Host_Configuration_Protocol). Since the 'D' in 'DHCP' stands for 'Dynamic', that means that your tablet's assigned IP address could get reassigned at any time, which would break some of the configuration that will be set up during the next few steps.

To assign a 'static' IP address, go into the Setting app on your tablet. Navigate to WiFi, then tap + hold your home netework. Select Manage Network Settings > Show Advanced Options. Change the IP Setting from DHCP to Static. Enter the IP address that you want your tablet to have - the simplest option is to enter the IP address that your tablet already has. If the Gateway doesn't fill in automatically, enter the same value as your IP address, replacing the last section (after the last `.`) with `1`.

TODO verify and add screenshots.

All set! Your tablet will now always receive the same IP address when connected to your home network. For the sake of simplicity in this guide, your tablet's `192.168.x.x` static IP address will now be referred to as the "internal network IP address".

### Port Forwarding
The configuration above works only when conneceted to your home network. Only your home router knows that, when it receives a request to access `192.168.x.x`, it should "route" that request to your Nexus 7 tablet. To prove this, disconnect your phone from WiFi, connect to data, and navigate to your tablet's internal network IP address. Nothing loads!

Let's fix that. First, some theory. Just like your tablet has an IP address, your entire home network also has an IP address. Think of your router as the "front door" of an apartment building - there is a number outside the door telling the mail carrier to deliver mail to that building (router), then it is the concierge's (router's) job to distribute the mail to the appropriate apartment number (device, like your tablet) in the building.

TODO insert diagram.

To access Home Assistant from outside your home network, we therefore need to know the "building number" (external IP address of your home network) and "apartment number" (port) to which we should send our requests.

To find the IP address of your home network, you can look in your router's admin console, or you can go to [whatismyipaddress.com](https://whatismyipaddress.com/) and look for the IPv4 field. We now know how to reach the correct "building".

To route requests to the correct device (apartment), we now need to set up port forwarding. Log in to your router's admin console and find the port forwarding configuration area. Set up a new port forward with the following:
- External port: 8123
- Internal port: 8123
- Internal address: your tablet's internal network IP address

Now, when your router receives a request to `<external-ip-address>:8123`, it will send it to `<internal-ip-address>:8123` - if you recall, this is the address where our Home Assistant installation is running. Test it out on your phone (being sure that you're still connected to mobile data).

Great! The Home Assistant installation is now accessible from outside your home network. However, two issues remain:
- The digits of the external IP address are hard to remember, and some external services (like Google Assistant) will require us to have a proper hostname.
- We are still accessing Home Assistant via an unencrypted `http://` connection, meaning an intruder could see your username and password as you enter them.

We'll resolve those two issues in the next sections.

### DNS Routing
The addressing setup completed in the previous step is, for the most part, how all internet traffic gets routed to the correct destination. You'll notice, however, that when you want to make a Google search, you don't navigate to `172.217.1.4` - you navigate to `google.com`. This mapping of human-friendly names to IP addresses is called a "Domain Name System" (DNS).

Registering a domain name - say, `myhomeassistant.org` - means that you're reserving the right to route traffic arriving at `myhomeassistant.org` to a web server owned by you. Most domain names cost money to reserve, but there are some services like [DuckDNS](https://www.duckdns.org/) and [No-IP](https://www.noip.com/) which offer free domain names. These services make money with their "premium" offerings, which are not required to complete this guide.

One additional feature of domain name services is "dynamic" DNS. The IP address of your router is provided by your internet service provider (ISP), and is liable to change at any time. If you were using that IP address to access your home assistant setup, any such change would break your configuration. A dynamic DNS provider takes this change in stride, automatically sending traffic to the updated IP address whenever it changes.

To set up your domain name, head to [No-IP](https://www.noip.com) and create an account. Create whatever hostname you'd like - make it something memorable! We'll call it `hass.noip.org` for simplicity in this guide. Set "IP / Target" to the external IP address of your network, then save the hostname.

After waiting a few hours for the new DNS record to propogate through name servers (or up to 2 days, according to No-IP's documentation), navigating to `http://hass.noip.org:8123` should now bring up your Home Assistant instance. Success!

If you prefer to use DuckDNS or another provider to reserve your hostname, that's no problem - the steps above should work the same.

#### Reverse Proxy
One common gotcha: if `http://hass.noip.org:8123` does not load for you when connected to your local WiFi, but does work when connected to mobile data, it's likely because your router does not support NAT Loopback (also known as NAT Hairpinning).

TODO finish this.

### SSL Certificate
When navigating to `http://hass.noip.org` in the previous step, a notice probably appeared on the left side of your address bar, saying something like "Not Secure!", with an open padlock logo. This is because an `http` connection is _unencrypted_ - traffic to and from the server is in plain text, and could be ready by anybody intercepting the traffic via a "man in the middle" attack. An `https` connection (where the `s` stands for "secure") is a more secure option. If you're not too concerned about security, you could skip this step - but it is required in order to integrate Google Assistant with Home Assistant in later steps of this guide.

To allow connections via `https`, your server first needs a TLS/SSL certificate. This type of certificate serves two purposes:
1. It includes the owner of the certificate, and includes the domain that content signed with this certificate should be coming from (preventing another server from spoofing this server). 
2. It provides a public key, which anybody wishing to communicate with a server can use to encrypt their traffic.

The certificate is issued by a Certificate Authority, which, as the name says, is an authoratitive body that has been trusted to issue certificates.

Just like with domains, there are free and paid Certificate Authorities from which certificates can be issued. We'll be using [LetsEncrypt](https://letsencrypt.org/) in this guide, which is a free option.

To receive a certificate from LetsEncrypt, you must prove that you "control" the domain for which you are requesting a certificate. That is, traffic to `hass.noip.org` goes to your server, and not somebody else's. This prevents you from generating a certificate for a server that does not belong to you.

LetsEncrypt provides the handy certbot tool for proving you own a domain, but it is not available in Termux, so some extra steps are required. 

__Option 1 - Complete the HTTP-01 Challenge Elsewhere__
- set up router to forward port 80 to port 80 of your computer
- install Apache on your computer
- run certbot in standalone mode to complete the challenge
- transfer the files from your computer to the tablet via ADB
- remove the port forward

__Option 2 - Complete the DNS-01 Challenge__
https://www.splitbrain.org/blog/2017-08/10-homeassistant_duckdns_letsencrypt

Once the certificate is generated, place the certificate files in the correct place and update the Home Assistant config.

More information: https://community.home-assistant.io/t/installing-tls-ssl-using-lets-encrypt/196975

### Remote SSH Access
TODO

### Startup at Reboot
TODO termux-wake-lock?

## Configuring Home Assistant
TODO

## Node-RED Installation
TODO
`nodejs`: a prerequisite to installing Node-RED, which will be addressed later in this guide
	- if you don't plan to use Node-RED, you can leave this out (or install it later)

## Mosquitto MQTT Installation
TODO
`mosquitto`: the lightweight [mosquitto MQTT broker](https://mosquitto.org/), for use alongside Home Assistant
	- if you don't plan to use MQTT, you can leave this out (or install it later)

## Google Assistant integration with Home Assistant
TODO