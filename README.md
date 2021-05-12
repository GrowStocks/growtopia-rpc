# growtopia-rpc

Growtopia Discord Rich Presence by GrowStocks.


# Instructions
- Download the .exe from the "Releases" tab
- Open the .exe file (the presence will only show if Growtopia and Discord are open at the same time) 
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

# Running with Growtopia

Why take time to fire this thing up everytime you run Growtopia? Here's a guide on how to tie both Growtopia and growtopia-rpc into one useful shortcut:
- You need to note the following somewhere in reach:
+ The location of growtopia-rpc (Hint: double click on the address bar in Explorer to highlight the address)
+ The location of Growtopia (usually located in C:\Users\username\AppData\Local\Growtopia)
- After that, make a shortcut from Growtopia.exe in your desktop (in the directory up there) by right-clicking, going on "Send", and clicking "Desktop (create shortcut)"
- Now pull up Notepad and paste the following (make sure to change the RPC and GT directories appopriately to your setup using the notes):
``@echo off
cd "C:\Users\User\Desktop\"
start growtopia-discord-rpc.exe
cd "C:\Users\User\AppData\Local\Growtopia"
start Growtopia.exe
exit``
- Now hit Ctrl+Shift+S, choose "All Files" from the dropdown below, and save your batch with a .bat extension, such as gt-discord.bat

This is essentially done, you now have a batch file you can use to launch both. But let's go a bit more for the style points and make a proper shortcut:
-Now go to the shortcut you have created in the step two, right click it and select "Properties"
-Replace the text in the "Target" section with the path to your batch (if you have it named gt.bat and it's on your desktop, it'll be something like C:\Users\User\Desktop\gt.bat)
-Press "Apply" and then press "Change Icon..."
-Press "OK" on the warning if there is one, and press "Browse". Then paste the Growtopia directory's address on the address bar. Choose Growtopia.exe, and then click the icon
-Press "OK" again, and tada, you now have a shortcut!

# Additional Notes

This script makes use of the data found in the `save.dat` file on your computer to be able to parse your GrowID as well as the world you're in.
This script does not use the `save.dat` file for purposes other than the ones mentioned above. The code has been made open-source for you to check for yourself.