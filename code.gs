const ss = sheetId => SpreadsheetApp.openById(sheetId)
const targetFolder = 'データを取得したいフォルダID'

function include (filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent()
}

/**
 * アプリにGETリクエストが送信されたとき実行されます
 */
function doGet (e) {
  const template = HtmlService.createTemplateFromFile('index')

  return template.evaluate()
}

/**
 * 指定したフォルダー内のファイル一覧を取得します
 */
function getFileData() {
  const files = DriveApp.getFolderById(targetFolder).getFiles();
  const arr = [];

  // ファイルの名前、idを取得し配列にします
  while (files.hasNext()) {
    const file = files.next();

    arr.push([file.getName(), file.getId()]);
  }

  // 取得した配列をオブジェクトに変換します
  const list = arr.map(row => {
    return {
      name: row[0],
      sheetId: row[1]
    }
  });

  return list
}

/**
 * ファイルを指定して、シート内の情報(シート名)を取得します
 * @param {String} sheetId
 * @returns {array} name
 */
function getSheetNames({ sheetId }) {
  const name = ss(sheetId).getSheets().map(sheet => sheet.getName())
  const obj = name.map(key => ({ sheetName: key }))
  
  return obj
}

