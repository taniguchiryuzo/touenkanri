var ACCESSTOKEN = ""

//spreadSheetの設定
var id = '1Aynor55Zj7QGeSk40xIyMIldkRbvSxKAZhmN2GCS5rU';//https://docs.google.com/spreadsheets/d/"この部分がidです"/edit#gid=1856578608
var spreadsheet = SpreadsheetApp.openById(id);

var URL = "https://api.line.me/v2/bot/message/reply"; // 応答メッセージ用のAPI URL


// ボットにメッセージ送信/フォロー/アンフォローした時の処理
function doPost(e) {
  var json = JSON.parse(e.postData.contents);  
  var reply_token= json.events[0].replyToken;  
  var user_id = json.events[0].source.userId;
  var user_message = json.events[0].message.text; //ここにメッセージが格納される

  // ユーザー名を取得する場合は、user_idから取得する必要がある。あと、ここはresponseという変数名に格納しないとエラーになる？
  var response = UrlFetchApp.fetch(
    'https://api.line.me/v2/bot/profile/' + user_id,
    {
      "headers": {
        "Authorization": "Bearer " + ACCESSTOKEN,
      }
    }
  );
  profile = JSON.parse(response);
  var username = profile.displayName

  var today = new Date();
  var month = today.getMonth() + 1;
  var date = today.getDate();
  var hour = today.getHours();
  var minute = today.getMinutes();
  var time = month + '月' + date + '日' +hour + ':' + minute;

  // 時間帯によってどの時限のシフトか分ける
//  switch (true) {
//    case hour <= 13:
//      var period = "lunch";
//      break
//    case hour <= 14:
//      var period = "3rd period";
//      break
//    case hour <= 16:
//      var period = "4th period";
//      break
//    default:
//      var period = "finished";
//      break
//  }

  if(user_message.includes('登園')){//登園という言葉を含む場合
    var sheet;
    sheet = spreadsheet.getSheetByName("sheet1");//sheet1に記入する
    sheet.appendRow([time, , ,  user_message,username]);//シートにメッセージを記入
    //返信
    
     textMessage = username + 'さんが登園されました！';
   
    pushMessage(textMessage, reply_token);
  }
  else if(user_message.includes('降園')){//降園という言葉を含む場合
    textMessage = username + 'さん、また明日ね！';
    sheet = spreadsheet.getSheetByName("sheet1");//sheet1に記入する
    sheet.appendRow([time, , ,  user_message, username]);//シートにメッセージを記入
    pushMessage(textMessage, reply_token);
  }
}

/*メッセージを送信*/
function pushMessage(textMessage, replyToken) {
  UrlFetchApp.fetch(URL, {
    "headers": {
      "Content-Type": "application/json; charset=UTF-8",
      "Authorization": "Bearer " + ACCESSTOKEN,
    },
    "method": "post",
    "payload": JSON.stringify({
      "replyToken": replyToken,
      "messages": [{
        "type": "text",
        "text": textMessage,
      }],
    }),
  });
}