# growtopia-rpc

Growtopia Discord Rich Presence by GrowStocks.


# Instructions
- Download the correct file for your OS from the "Releases" tab
- Open the downloaded file (the presence will only show if Growtopia and Discord are open at the same time) 
- If the Rich Presence doesn't show on Discord, try completely closing then re-opening Discord

# Instructions (if you're a skeptic)
If you're skeptical about using the provided executables, you can compile the source code above yourself into a working executable file.

## Prerequisites
1. Have Node.JS installed on your system
2. Have some knowledge on how programming works

## How-to
1. Open the Command Prompt
2. Run `npm install` to install all required modules
3. Run `pkg index.js` to compile the Node.JS script into a .exe file
4. Follow the instructions found above starting from the second step

# Expected Result

![Presence](https://i.imgur.com/5dYcvV1.png)

# Running on startup

If you would like to permanently run the script so that it automatically detects when you open the game and sets your presence without having to open it everytime, read on.
- Search for "Task Scheduler" via the start menu
- Click on "Task Scheduler (Local)", then on "Actions" (in the top-bar), then "Create Task.."
- Fill in the fields as follows:
+ Name: Growtopia Discord Rich Presence
+ Configure for: (your version of Windows)
- In the top-bar, click on "Triggers", then "New..."
- Select "Begin the task:" -> "At log on", then click on "OK"
- In the top-bar, click on "Actions", then "New..."
- Fill in the fields as follows:
+ Program/script: click on "Browse..." and select the .exe you downloaded previously
- Click on "OK", and "OK" once again
- You're done. Restart your computer for the changed to take effect

# Additional Notes

This script makes use of the data found in the `save.dat` file on your computer to be able to parse your GrowID as well as the world you're in.
This script does not use the `save.dat` file for purposes other than the ones mentioned above. The code has been made open-source for you to check for yourself.