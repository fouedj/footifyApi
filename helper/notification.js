const  onesignal =require("simple-onesignal");
const sendNotification = (_data, cb = null) => {
onesignal.configure("69e4e338-81f5-4e83-9437-b3bd9d6f6168", "NzZlMmE4MTMtNjlmMC00NTU3LWIzYzUtNTU3NTE5YzI0YmEz");
    return onesignal.sendMessage({
            headings: {en: _data.head ? _data.head : ""},
            ttl: 30,
            contents: {en: _data.body ? _data.body : ""},
            // check this filter
            filters: [{field: "tag", relation: "=", key: "id", value: _data.userId}],
            included_segments: ["Active Users", "Inactive Users"],
            buttons: _data.button ? _data.button :[{"id": "id_close", "text": "Fermer", "icon": "ic_menu_share"}],
            data: _data.data
        },
        function(err, resp) {
            if (cb) {
                cb(err, resp);
            }
        }); 
};

module.exports={sendNotification}