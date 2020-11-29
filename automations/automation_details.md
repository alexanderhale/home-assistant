# Automations
This section documents some automations that can be made after following the setup guide. Some are specific to running the Home Assistant server on an Android tablet, and some could be implemented on any Home Assistant installation.

## Tablet Battery Preservation
Keeping the tablet permanently charged at 100% could eventually cause a decrease in battery life. Some Googling indicated that a healthy range to keep the battery is between 65% and 75% (although this is certainly not the best range for every device, so you should do your own research!). 

Prerequisites for this automation:
- a smart plug, added in your Home Assistant configuration
- the Home Assistant Companion App installed on the tablet

In the Home Assistant UI, navigate to Configuration > Automations, and create a new Automation. Add a name and description, and leave the mode as "Single".
![](automations/setup/tablet_charger/name_and_description.png)

In the Triggers section, add two triggers:
- when the tablet battery rises above 75%
- when the tablet battery drops below 65%
![](automations/setup/tablet_charger/75_percent_trigger.png)
![](automations/setup/tablet_charger/65_percent_trigger.png)

In the Actions section, select the "Toggle" action.
![](automations/setup/tablet_charger/toggle_action.png)

If you prefer to manually enter the automation in your automations.yaml, check out [tablet_plug_automation.yaml](automations/setup/tablet_charger/tablet_automation.yaml).