# growtopia-rpc

Growtopia Discord Rich Presence by GrowStocks.


# Instructions
- Download the correct file for your operating system from the "Releases" tab
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

# Running with Growtopia (Windows only)

## Desktop shortcut
If you would like to automatically run this script _only when you open Growtopia_, read on. Here's a guide on how to tie both Growtopia and growtopia-rpc into one useful shortcut:
- Note the following somewhere in reach:
+ The location of growtopia-rpc (Hint: double click on the address bar in Explorer to highlight the address)
+ The location of Growtopia (usually located in C:\Users\username\AppData\Local\Growtopia)
- Next, make a shortcut from Growtopia.exe onto your desktop (in the directory up there) by right-clicking, going on "Send", and clicking "Desktop (create shortcut)"
- Now pull up Notepad and paste the following (make sure to change the Growtopia and growtopia-rpc directories appopriately to your setup using the notes above):

```
@echo off
cd "C:\Users\User\Desktop\"
start /MIN "" "growtopia-discord-rpc.exe" ON_CLOSE_EXIT
cd "C:\Users\User\AppData\Local\Growtopia"
start Growtopia.exe
exit
```
- Hit `Ctrl+Shift+S`, choose "All Files" from the dropdown below, and save your batch file with a .bat extension, such as `growtopia-rpc.bat`
- Go to the shortcut you have created in step two, right click on it, and select "Properties"
- Replace the text in the "Target" section with the path to your batch (if you have it named `growtopia-rpc.bat` and it's on your desktop, it'll be something like `C:\Users\User\Desktop\growtopia-rpc.bat`)
- Press "Apply" and then press "Change Icon..."
- Press "OK" on the warning if there is one, and press "Browse". Now, paste the Growtopia directory address in the address bar. Choose Growtopia.exe, and then click on the icon
- Press "OK" again
- You're done. You can now use this shortcut to boot up both Growtopia and growtopia-rpc at once

## Windows start menu binding (optional)
To also automatically open this program when you launch Growtopia from the start menu, read on.
- Type "Growtopia" in the search bar
- Right click on the result, and click on "Open file location"
- Copy the shortcut you have created [in the tutorial above](#desktop-shortcut), then paste it in the Windows Explorer instance that you have opened in previous step (if prompted to replace the shortcut, click "Yes")
- You're done. Launching Growtopia from the start menu should now automatically open the Growtopia RPC program

# Running on startup (Windows only)

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
