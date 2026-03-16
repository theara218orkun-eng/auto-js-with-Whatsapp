"auto";
auto.waitFor();

const TARGET_PACKAGE = "com.whatsapp";

let replied = {};
const COOLDOWN = 5000; // 5 seconds

events.observeNotification();

toast("WhatsApp Auto Bot Running");

events.on("notification", function(n){

    try{

        if(n.getPackageName() !== TARGET_PACKAGE) return;

        let sender = n.getTitle();
        let text = n.getText();

        if(!text){
            console.log("Empty ignored");
            return;
        }

        if(text.includes("new messages")){
            console.log("Grouped notification ignored");
            return;
        }

        let messageId = sender + ":" + text;

        let now = new Date().getTime();

        if(replied[messageId] && now - replied[messageId] < COOLDOWN){
            console.log("Duplicate ignored:", messageId);
            return;
        }

        replied[messageId] = now;

        console.log("New message:", sender, text);

        let clicked = n.click();

        if(!clicked){
            console.log("Opening WhatsApp manually");
            app.launchPackage(TARGET_PACKAGE);
        }

        sleep(4000);

        handleKeyword(text);

    }catch(err){
        console.log("Error:", err);
    }

});


function handleKeyword(message){

    message = message.toLowerCase();

    if(message.includes("hi") || message.includes("hello")){
        sendText("Hello 👋 Welcome to our service");
    }

    else if(message.includes("price")){
        sendImage("/sdcard/autojs/media/product.jpg");
    }

    else if(message.includes("voice")){
        sendVoice();
    }

    else if(message.includes("sticker")){
        sendSticker();
    }

    else{
        sendText("Please type: hi, price, voice, sticker");
    }

    sleep(2000);
    backToChats();

}


// ---------------- TEXT ----------------

function sendText(msg){

    let input = id("com.whatsapp:id/entry").findOne(5000);

    if(!input){
        console.log("Input not found");
        return;
    }

    input.setText(msg);

    sleep(500);

    let send = id("com.whatsapp:id/send").findOne(3000);

    if(send){
        send.click();
        console.log("Text sent");
    }

}


// ---------------- IMAGE ----------------

function sendImage(path){

    console.log("Sending image");

    click("Attach");

    sleep(1500);

    click("Gallery");

    sleep(3000);

    let img = className("android.widget.ImageView").findOne(5000);

    if(img) img.click();

    sleep(1000);

    let send = id("com.whatsapp:id/send").findOne(5000);

    if(send){
        send.click();
    }

}


// ---------------- VOICE ----------------

function sendVoice(){

    console.log("Sending voice");

    click("Attach");

    sleep(1500);

    click("Audio");

}


// ---------------- STICKER ----------------

function sendSticker(){

    console.log("Sending sticker");

    let stickerBtn = descContains("Sticker").findOne(5000);

    if(stickerBtn){

        stickerBtn.click();

        sleep(1000);

        let sticker = className("android.widget.ImageView").findOne(5000);

        if(sticker){
            sticker.click();
        }

    }

}


// ---------------- BACK ----------------

function backToChats(){

    for(let i=0;i<5;i++){

        if(text("Chats").exists() || id("com.whatsapp:id/tabs").exists()){
            console.log("Back to chats");
            return;
        }

        back();
        sleep(1200);
    }

    console.log("Reopening WhatsApp");

    app.launchPackage(TARGET_PACKAGE);

    sleep(3000);

}


setInterval(()=>{},1000);
