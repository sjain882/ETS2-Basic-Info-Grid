![SCREENSHOT](https://github.com/sjain882/ETS2-Basic-Info-Grid/blob/main/Preview.png?raw=true)

Requires "TelemetryServer4" min. v4.1.2.4 by [PauloTNCunha](https://github.com/PauloTNCunha) - [original repo](https://github.com/PauloTNCunha/TelemetryServer4) | [preserved repo](https://github.com/sjain882/TelemetryServer4) and the version of SCS's telemetry SDK plugin included in that repo. Untested on newer versions of the SDK!

ETS2 Telemetry Server 4 skin designed for peripheral vision / corners of the eye. Meant to be as simple as possible - e.g., information conveyed through presence or absence of elements.

Should be compatible with ATS with a few changes but untested.

In real life, I display this on a 5.8" AMOLED phone mounted right under my monitor in the centre (I used a car windshield suction mount on the monitor stand to hold it in perfect place), so I don't have to look left/right and lose TrackIR awareness.

Wasn't originally intended to be public - this is just for my personal use. I am keeping it practical and only replicating things that:
- The game currently offers no UI indications for
- The things that make me flick on/off route-advisor most
- Data that is only on some truck dashboards but not all
- Whilst also respecting the fun mechanics of the game, e.g, 
    - Where you have to zoom into things on the dashboard
    - Where absence of knowledge is realistic

For future update - I'll make it so clicking any part of the screen once switches to a job info page with fuel/distance/time remaining and current time, maybe implementing the smart messages system from jobmonitor2P. Probably never going to bother though.

I wanted to make this fully modular, but due to my limited HTML, CSS, JS experience it's kind of clunky between devices. Doesn't take too long to adapt though. 

Uses CSS Grid, but the positioning of items inside the grid is controlled by padding values. It is mainly tuned for a specific device ([Huawei P20](https://www.gsmarena.com/huawei_p20-9107.php)).

Quick notes:

- Over-speed has space for 3 red bars - each red bar indicates 1 mph above speed limit

- Shifter gear group means the range (false: Lower 1-6 / true: Upper 7-12)

- Shifter gear range means the splitters (false: Low 1L / true: High 1H)

# True full-screen on Android 4.1+

For some reason this was kind of awkward, using an ADB or [Quick Settings](https://play.google.com/store/apps/details?id=it.simonesestito.ntiles&hl=en_GB&gl=US) immersive mode enabler didn't work on some A11 devices but worked on others.

Found a reliable solution though. You can use Dolphin Browser - [play store](https://play.google.com/store/apps/details?id=mobi.mgeek.TunnyBrowser&hl=en_GB&gl=US) | [apkmirror](https://www.apkmirror.com/apk/dolphin-browser/):

1. Open the skin in dolphin browser
2. Click dolphin icon in bottom middle.
3. Add to > Home screen.
4. Click extensions (puzzle) icon in top right.
5. Click full screen.
6. Enable auto rotate on your phone settings, and make phone landscape.

The full screen setting will be remembered next time, so you can just hit the skin icon on your homescreen and thats it!

NOTE: Dolphin (but not your phone) will be stuck in full screen at this point! Since swiping to access the menus again changes size, due to ETS2 Telemetry Server internal autosizing logic, the page will refresh, and it'll go back to full screen.

To access dolphin UI again you need to go to home screen, swipe out dolphin from recent apps, and click on normal dolphin app icon (not shortcut to the skin).

# Adapting the skin to another device:

First, finalise how you will be viewing the skin. e.g., in a full-screen browser - if you adapt it to a non-fullscreen browser, it will look different in full-screen!

Then, make the grid fill the screen properly. Due to the internal special viewport scaling ETS2 Telemetry Server does, I couldn't make this automatic.

You can do this in config.json. Adjust the width and height values. It will never equal the actual device resolution, but will be something much lower instead, e.g., Pixel 2 XL 2880x1440 screen fits perfect with 880x440 (and same for Huawei P20 2240x1080).

Then you may need to adjust label and/or data padding. Analyse the css file and update it accordingly - all the relevant classes are near the top, before the grid layout.

# Credits:

- [PauloTNCunha](https://github.com/PauloTNCunha) - TelemetryServer4 and jobmonitor2P skin where some inspiration and JS code was taken from

- [FunBit](https://github.com/Funbit) - [Original ETS2 Telemetry Server](https://github.com/Funbit/ets2-telemetry-server) which TelemetryServer4 was forked from

- [sjain882](https://github.com/sjain882) - Creating this skin & readme

- SCS Software - for developing ETS2 & the [telemetry plugin](https://modding.scssoft.com/wiki/Documentation/Engine/SDK/Telemetry).