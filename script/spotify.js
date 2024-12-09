const axios = require('axios');
const fs = require('fs');

module.exports.config = {
    name: "spotify",
    version: "1.0.0",
    aliases:["sing"], 
    role: 0,
    hasPermision: 0,
    credits: "Jay king",//api by kim
    description: "Search and play music from Spotify",
    commandCategory: "spotify",
    hasPrefix: true,
    usage: "[song name]",
    cooldowns: 5,
    usePrefix: false,
    usages: "[song name]",
    cooldown: 5,  
};

module.exports.run = async function ({ api, event, args }) {
    const listensearch = encodeURIComponent(args.join(" "));
    const apiUrl = `https://hiroshi-api-hub.replit.app/music/spotify?search=${listensearch}`;

    if (!listensearch) return api.sendMessage("Please provide the name of the song you want to search.", event.threadID, event.messageID);

    try {
        api.sendMessage("🎵 | 𝗦𝗘𝗔𝗥𝗖𝗛𝗜𝗡𝗚 𝗬𝗢𝗨𝗥 𝗦𝗢𝗡𝗚....🧋", event.threadID, event.messageID);

        const response = await axios.get(apiUrl);
        const [{ name, track, download, image }] = response.data;

        if (name) {
            const filePath = `${__dirname}/../cache/${Date.now()}.mp3`;
            const writeStream = fs.createWriteStream(filePath);

            const audioResponse = await axios.get(download, { responseType: 'stream' });

            audioResponse.data.pipe(writeStream);

            writeStream.on('finish', () => {
                api.sendMessage({
                    body: `🎧| 𝗬𝗢𝗨𝗥 𝗠𝗨𝗦𝗜𝗖 \n\n𝗧𝗶𝘁𝗹𝗲🧃: ${name}\n𝗧𝗿𝗮𝗰𝗸✴: ${track}\n𝗗𝗼𝘄𝗻𝗹𝗼𝗮𝗱[⚙️]: ${download}\nImage: ${image}\n\𝗻🚬 𝗡𝗼𝘄 𝗣𝗹𝗮𝘆𝗶𝗻𝗴...`,
                    attachment: fs.createReadStream(filePath),
                }, event.threadID, () => fs.unlinkSync(filePath), event.messageID);
            });
        } else {
            api.sendMessage("❓ | Sorry, couldn't find the requested music on Spotify.", event.threadID);
        }
    } catch (error) {
        console.error(error);
        api.sendMessage("🚧 | An error occurred while processing your request.", event.threadID);
    }
};
