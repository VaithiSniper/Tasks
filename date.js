exports.getDate = function ()
{
let today = new Date();
            let options = {
                day: "numeric",
                weekday: "long",
                month: "long"
            }
            let day = today.toLocaleDateString("en-US", options);
    return day;
}
exports.getDay =function()
{
let today = new Date();
            let options = {
          
                weekday: "long",
                
            }
            let day = today.toLocaleDateString("en-US", options);
    return day;
}