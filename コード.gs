const ss = sheetId => SpreadsheetApp.openById(sheetId)
const targetFolder = 'データを取得したいフォルダ'

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
 * 指定したフォルダー(targetFolder)内のファイル一覧を取得します
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

/**
 * データを追加します
 */
function onPost ({ item, sheetId, sheetName }) {
  const { date, title, memo } = item

  //指定した名前のシートを取得します
  const sheet = ss(sheetId).getSheetByName(sheetName)

  const id = Utilities.getUuid().slice(0, 8)
  const row = ["'", "'" + id, "'" + date, "'" + title, "'" + memo]
  sheet.appendRow(row)

  return { id, date, title, memo }
}

/**
 * シート内のデータ一覧を取得します
 */
function onGet ({ sheetId, sheetName }) {
  const sheet = ss(sheetId).getSheetByName(sheetName)
  const lastRow = sheet ? sheet.getLastRow() : 0

  if (lastRow < 3) {
    return []
  }

  const list = sheet.getRange('B3:E' + lastRow).getValues().map(row => {
    const [id, date, title, memo] = row
    return {
      id,
      date,
      title,
      memo
    }
  })

  return list
}
