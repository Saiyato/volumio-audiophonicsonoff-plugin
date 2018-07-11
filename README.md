# volumio-audiophonicsonoff-plugin
Volumio plugin to configure the power button (with backlight) behavior connected to an Audiophonics Sabre soundcard 

Information from Jedail is used, because I wanted to use pydPiper for the LCD I stripped the LCD code.
Source: https://github.com/JedS/Raspdac

You can configure three GPIO pins:

1. The GPIO pin which is set to HIGH when Volumio receives a shutdown command
2. The GPIO pin which is set to HIGH when the power button is pressed
3. The GPIO pin which is set to HIGH after booting successfully (i.e. Volumio and this plugin have started)

## Configuration
![Alt text](/images/settings.png?raw=true "Settings")

Software shutdown: sends a high signal to this pin when a shutdown/restart is triggered from within Volumio
Shutdown button: when this pin detects a high signal, a shutdown sent to Volumio (software)
Successful boot: this is the BootOK trigger, when this plugin is started by Volumio, a high signal is sent to this pin

## pydPiper
The pydPiper plugin can be found here: https://github.com/Saiyato/volumio-pydpiper-plugin
