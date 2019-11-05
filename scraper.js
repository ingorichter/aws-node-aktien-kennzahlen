/**
 * page is the HTML page and this function is extracting data from this page.
 * The extracted data is saved in a hash to be returned as json to the caller
 * 
 * Eine bessere Fehlerbehandlung ist definitiv notwendig :-)
 */
module.exports.scrape = async (page) => {
    const startJahr = 2014;
    const aggregierteDaten = {};

    page.on('console', msg => {
        for (let i = 0; i < msg.args().length; ++i)
          console.log(`${i}: ${msg.args()[i]}`);
    });

    aggregierteDaten.aktienPreis = await page.$eval(".snapshotQuotesBox > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(1) > span:nth-child(1) > span:nth-child(1)", el => el.innerText.trim());
    aggregierteDaten.aktienWaehrung = await page.$eval(".snapshotQuotesBox > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(1) > span:nth-child(1) > span:nth-child(2)", el => el.innerText.trim());
 
    aggregierteDaten.aktienUmlauf = {};
    [2, 3, 4, 5, 6].forEach(async (value, index) => {
        aggregierteDaten.aktienUmlauf[startJahr + index] = await page.$eval(`div.tabelleUndDiagramm:nth-child(6) > div:nth-child(3) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(${value})`, el => el.innerText);
    });

    // das kann manchmal an einer anderen Position erscheinen. Deshalb Position finden und alles dazu ist relativ
    const summeEigenkapitalTabelle = await page.evaluateHandle(() => {
        var pfeilImage = document.querySelector("#guv17pfeil");
        if (pfeilImage) {
            return pfeilImage.parentElement.parentElement;
        }

        // manchmal benutzen sie auch guv18pfeil!?
        pfeilImage = document.querySelector("#guv18pfeil");

        if (pfeilImage) {
            return pfeilImage.parentElement.parentElement;
        }
    });

    if (summeEigenkapitalTabelle.asElement() !== null) {
        aggregierteDaten.summeEigenkapital = {};

        aggregierteDaten.summeEigenkapital[startJahr + 0] = await summeEigenkapitalTabelle.$eval("td:nth-child(2)", el => el.innerText);
        aggregierteDaten.summeEigenkapital[startJahr + 1] = await summeEigenkapitalTabelle.$eval("td:nth-child(3)", el => el.innerText);
        aggregierteDaten.summeEigenkapital[startJahr + 2] = await summeEigenkapitalTabelle.$eval("td:nth-child(4)", el => el.innerText);
        aggregierteDaten.summeEigenkapital[startJahr + 3] = await summeEigenkapitalTabelle.$eval("td:nth-child(5)", el => el.innerText);
        aggregierteDaten.summeEigenkapital[startJahr + 4] = await summeEigenkapitalTabelle.$eval("td:nth-child(6)", el => el.innerText);
    }

    aggregierteDaten.eigenKapitalRendite = {};

    aggregierteDaten.eigenKapitalRendite[startJahr + 0] = await page.$eval("div.tabelleUndDiagramm:nth-child(8) > div:nth-child(3) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(8) > td:nth-child(2)", el => el.innerText);
    aggregierteDaten.eigenKapitalRendite[startJahr + 1] = await page.$eval("div.tabelleUndDiagramm:nth-child(8) > div:nth-child(3) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(8) > td:nth-child(3)", el => el.innerText);
    aggregierteDaten.eigenKapitalRendite[startJahr + 2] = await page.$eval("div.tabelleUndDiagramm:nth-child(8) > div:nth-child(3) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(8) > td:nth-child(4)", el => el.innerText);
    aggregierteDaten.eigenKapitalRendite[startJahr + 3] = await page.$eval("div.tabelleUndDiagramm:nth-child(8) > div:nth-child(3) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(8) > td:nth-child(5)", el => el.innerText);
    aggregierteDaten.eigenKapitalRendite[startJahr + 4] = await page.$eval("div.tabelleUndDiagramm:nth-child(8) > div:nth-child(3) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(8) > td:nth-child(6)", el => el.innerText);

    aggregierteDaten.dividendenRendite = {};
    // TODO(INGO): this loop always causes an exception!?
    // [2, 3, 4, 5, 6].forEach(async (value, index) => {
    //     aggregierteDaten.dividendenRendite[startJahr + index] = await page.$eval(`div.tabelleUndDiagramm:nth-child(8) > div:nth-child(3) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(6) > td:nth-child(${value})`, el => el.innerText.trim());
    // });

    aggregierteDaten.dividendenRendite[startJahr + 0] = await page.$eval("div.tabelleUndDiagramm:nth-child(8) > div:nth-child(3) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(6) > td:nth-child(2)", el => el.innerText.trim());
    aggregierteDaten.dividendenRendite[startJahr + 1] = await page.$eval("div.tabelleUndDiagramm:nth-child(8) > div:nth-child(3) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(6) > td:nth-child(3)", el => el.innerText.trim());
    aggregierteDaten.dividendenRendite[startJahr + 2] = await page.$eval("div.tabelleUndDiagramm:nth-child(8) > div:nth-child(3) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(6) > td:nth-child(4)", el => el.innerText.trim());
    aggregierteDaten.dividendenRendite[startJahr + 3] = await page.$eval("div.tabelleUndDiagramm:nth-child(8) > div:nth-child(3) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(6) > td:nth-child(5)", el => el.innerText.trim());
    aggregierteDaten.dividendenRendite[startJahr + 4] = await page.$eval("div.tabelleUndDiagramm:nth-child(8) > div:nth-child(3) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(6) > td:nth-child(6)", el => el.innerText.trim());

    return aggregierteDaten;
}