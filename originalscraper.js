module.exports.scrape = async (page) => {
    const startJahr = 2014;
    const aggregierteDaten = {};

    // const browser = await puppeteer.launch({executablePath: "/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome"});
    // const page = await browser.newPage();
    
    page.on('console', msg => {
        for (let i = 0; i < msg.args().length; ++i)
          console.log(`${i}: ${msg.args()[i]}`);
    });

    // await page.screenshot({path: 'example.png'});
    aggregierteDaten.aktienPreis = await page.$eval(".snapshotQuotesBox > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(1) > span:nth-child(1) > span:nth-child(1)", el => el.innerText.trim());
    aggregierteDaten.aktienWaehrung = await page.$eval(".snapshotQuotesBox > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(1) > span:nth-child(1) > span:nth-child(2)", el => el.innerText.trim());
 
    aggregierteDaten.aktienUmlauf = {};
    [2, 3, 4, 5, 6].forEach(async (value, index) => {
        aggregierteDaten.aktienUmlauf[startJahr + index] = await page.$eval(`div.tabelleUndDiagramm:nth-child(6) > div:nth-child(3) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(${value})`, el => el.innerText);
    });

    // const aktienUmlauf2014 = await page.$eval("div.tabelleUndDiagramm:nth-child(6) > div:nth-child(3) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(2)", el => el.innerText);
    // const aktienUmlauf2015 = await page.$eval("div.tabelleUndDiagramm:nth-child(6) > div:nth-child(3) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(3)", el => el.innerText);
    // const aktienUmlauf2016 = await page.$eval("div.tabelleUndDiagramm:nth-child(6) > div:nth-child(3) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(4)", el => el.innerText);
    // const aktienUmlauf2017 = await page.$eval("div.tabelleUndDiagramm:nth-child(6) > div:nth-child(3) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(5)", el => el.innerText);
    // const aktienUmlauf2018 = await page.$eval("div.tabelleUndDiagramm:nth-child(6) > div:nth-child(3) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(6)", el => el.innerText);
    
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
        // [2, 3, 4, 5, 6].forEach(async (value, index) => {
        //     try
        //     {
        //         aggregierteDaten.summeEigenkapital[startJahr + index] = await summeEigenkapitalTabelle.$eval(`td:nth-child(${value})`, el => el.innerText);
        //     }
        //     catch(e)
        //     {
        //         console.log(e);
        //     }
        // });

        aggregierteDaten.summeEigenkapital[startJahr + 0] = await summeEigenkapitalTabelle.$eval("td:nth-child(2)", el => el.innerText);
        aggregierteDaten.summeEigenkapital[startJahr + 1] = await summeEigenkapitalTabelle.$eval("td:nth-child(3)", el => el.innerText);
        aggregierteDaten.summeEigenkapital[startJahr + 2] = await summeEigenkapitalTabelle.$eval("td:nth-child(4)", el => el.innerText);
        aggregierteDaten.summeEigenkapital[startJahr + 3] = await summeEigenkapitalTabelle.$eval("td:nth-child(5)", el => el.innerText);
        aggregierteDaten.summeEigenkapital[startJahr + 4] = await summeEigenkapitalTabelle.$eval("td:nth-child(6)", el => el.innerText);
    }

    aggregierteDaten.eigenKapitalRendite = {};
    // [2, 3, 4, 5, 6].forEach(async (value, index) => {
    //     console.log(index);
    //     try
    //     {
    //         aggregierteDaten.eigenKapitalRendite[startJahr + index] = await page.$eval(`div.tabelleUndDiagramm:nth-child(8) > div:nth-child(3) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(8) > td:nth-child(${value})`, el => el.innerText);
    //     }
    //     catch(e)
    //     {
    //         console.log(e);
    //     }
    // });

    aggregierteDaten.eigenKapitalRendite[startJahr + 0] = await page.$eval("div.tabelleUndDiagramm:nth-child(8) > div:nth-child(3) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(8) > td:nth-child(2)", el => el.innerText);
    aggregierteDaten.eigenKapitalRendite[startJahr + 1] = await page.$eval("div.tabelleUndDiagramm:nth-child(8) > div:nth-child(3) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(8) > td:nth-child(3)", el => el.innerText);
    aggregierteDaten.eigenKapitalRendite[startJahr + 2] = await page.$eval("div.tabelleUndDiagramm:nth-child(8) > div:nth-child(3) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(8) > td:nth-child(4)", el => el.innerText);
    aggregierteDaten.eigenKapitalRendite[startJahr + 3] = await page.$eval("div.tabelleUndDiagramm:nth-child(8) > div:nth-child(3) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(8) > td:nth-child(5)", el => el.innerText);
    aggregierteDaten.eigenKapitalRendite[startJahr + 4] = await page.$eval("div.tabelleUndDiagramm:nth-child(8) > div:nth-child(3) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(8) > td:nth-child(6)", el => el.innerText);

    // const eigenKapitalRendite2014 = await page.$eval("div.tabelleUndDiagramm:nth-child(8) > div:nth-child(3) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(8) > td:nth-child(2)", el => el.innerText);
    // const eigenKapitalRendite2015 = await page.$eval("div.tabelleUndDiagramm:nth-child(8) > div:nth-child(3) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(8) > td:nth-child(3)", el => el.innerText);
    // const eigenKapitalRendite2016 = await page.$eval("div.tabelleUndDiagramm:nth-child(8) > div:nth-child(3) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(8) > td:nth-child(4)", el => el.innerText);
    // const eigenKapitalRendite2017 = await page.$eval("div.tabelleUndDiagramm:nth-child(8) > div:nth-child(3) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(8) > td:nth-child(5)", el => el.innerText);
    // const eigenKapitalRendite2018 = await page.$eval("div.tabelleUndDiagramm:nth-child(8) > div:nth-child(3) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(8) > td:nth-child(6)", el => el.innerText);

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

    // const dividendenRendite2014 = await page.$eval("div.tabelleUndDiagramm:nth-child(8) > div:nth-child(3) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(6) > td:nth-child(2)", el => el.innerText.trim());
    // const dividendenRendite2015 = await page.$eval("div.tabelleUndDiagramm:nth-child(8) > div:nth-child(3) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(6) > td:nth-child(3)", el => el.innerText.trim());
    // const dividendenRendite2016 = await page.$eval("div.tabelleUndDiagramm:nth-child(8) > div:nth-child(3) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(6) > td:nth-child(4)", el => el.innerText.trim());
    // const dividendenRendite2017 = await page.$eval("div.tabelleUndDiagramm:nth-child(8) > div:nth-child(3) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(6) > td:nth-child(5)", el => el.innerText.trim());
    // const dividendenRendite2018 = await page.$eval("div.tabelleUndDiagramm:nth-child(8) > div:nth-child(3) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(6) > td:nth-child(6)", el => el.innerText.trim());

    return aggregierteDaten;
}