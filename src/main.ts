/// <reference types="@workadventure/iframe-api-typings" />

import { bootstrapExtra } from "@workadventure/scripting-api-extra";

console.log('Script started successfully');

let currentPopup: any = undefined;

// Waiting for the API to be ready
WA.onInit().then(() => {
    console.log('Scripting API ready');
    console.log('Player tags: ',WA.player.tags)

    WA.room.area.onEnter('clock').subscribe(() => {
        const today = new Date();
        const time = today.getHours() + ":" + today.getMinutes();
        currentPopup = WA.ui.openPopup("clockPopup", "It's " + time, []);
    })

    WA.room.area.onLeave('clock').subscribe(closePopup)

    // The line below bootstraps the Scripting API Extra library that adds a number of advanced properties/features to WorkAdventure
    bootstrapExtra().then(() => {
        console.log('Scripting API Extra ready');
    }).catch(e => console.error(e));

}).catch(e => console.error(e));

function closePopup(){
    if (currentPopup !== undefined) {
        currentPopup.close();
        currentPopup = undefined;
    }
}

function shrineAnim(state: boolean) { 
    if (state === true) {
        WA.room.showLayer('furniture/Garden/ShrineAnimOn');
    } else {
        WA.room.hideLayer('furniture/Garden/ShrineAnimOff');
    }
}

WA.state.onVariableChange('shrineState').subscribe((shrineState) => {
        console.log('shrineState changed');
        // Each time the "shrineState" variable changes, we call the "shrineAnim" function to update the door image visually.
        shrineAnim(shrineState as boolean);
    });

    // When someone walks on the doorstep (inside the room), we display a message to explain how to open or close the door
    WA.room.onEnterLayer('furniture/Garden/ShrineStateAction').subscribe(() => {
        WA.room.showLayer('furniture/Garden/ShrineAnimOn');
        console.log('Enter');
    });

    // When someone leaves the doorstep (inside the room), we remove the message
    WA.room.onLeaveLayer('doorsteps/inside_doorstep').subscribe(() => {
        WA.room.hideLayer('furniture/Garden/ShrineAnimOn');
        console.log('Exit');
    });

export {};

