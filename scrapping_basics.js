var analysis = [];
var interestedSymbols = ["BTC","ETH","USDT","SOL","XRP","USDC","ADA","AVAX","DOGE","DOT","TRX","LINK","MATIC","SHIB","LTC","BCH","UNI","ICP","XLM","INJ","ATOM","IMX","HBAR","ETC","NEAR","CRO","FIL","APT","STX","OP","LDO","RNDR","EGLD","ALGO","QNT","GRT","AAVE","ARB","FLOW","SNX","FTM","MKR","SAND","AXS","GALA","MANA","EOS","MINA","KAVA","XTZ","DYDX","FET","SUI","BLUR","APE","WAXL","RPL","PEPE","FLR","CRV","CHZ","1INCH","GMT","DASH","BAT","ENJ","COMP","TRB","LRC","CELO","ZRX","OCEAN","ANKR","JASMY","LPT","MASK","BICO","YFI","CVX","KSM","SUPER","AUDIO","ENS","SKL","BAND","ANT","AMP","SUSHI","BAL","GAL","STORJ","API3","UMA","C98","BLZ","CTSI","POLS","RLC","PLA","POND","KNC","OMG","CELR","NMR","ACH","ALICE","BNT","NKN","GODS","AGLD","RARE","CVC","COTI","RAD","SPELL","REQ","SYN","OGN","HFT","PERP","UNFI","OXT","TRU","LCX","ARPA","XCN","IDEX","GHST","CLV","FIDA","FORTH","MLN","TVK","GST","FARM"];


// Function to analyze indicators for a given coin
function analyzeIndicators(
    coin,
    rsi,
    mom,
    ao,
    cci,
    stochK,
    stochD,
    macdLevel,
    macd
) {
    // Initialize data for the current coin
    var indicatorData = {};

    // Create a nested structure to store indicator values and interpretations
    indicatorData[coin] = {
        "RSI (14)": { value: rsi, interpretation: "" },
        "Mom (10)": { value: mom, interpretation: "" },
        AO: { value: ao, interpretation: "" },
        "CCI (20)": { value: cci, interpretation: "" },
        "Stoch (14,3,3) %K": { value: stochK, interpretation: "" },
        "Stoch (14,3,3) %D": { value: stochD, interpretation: "" },
        "MACD (12,26) Level": { value: macdLevel, interpretation: "" },
        "MACD (12,26)": { value: macd, interpretation: "" },
    };

    // Interpret RSI
    if (rsi > 70) {
        indicatorData[coin]["RSI (14)"].interpretation =
            "RSI values above 70 typically indicate overbought conditions, suggesting a potential reversal.";
    } else if (rsi < 30) {
        indicatorData[coin]["RSI (14)"].interpretation =
            "RSI values below 30 suggest oversold conditions, indicating a potential upward reversal.";
    } else {
        indicatorData[coin]["RSI (14)"].interpretation = "RSI within a neutral range.";
    }

    // Interpret Momentum
    indicatorData[coin]["Mom (10)"].interpretation = mom > 0
        ? "In the context of the Momentum (10) indicator, a positive value indicates strong positive momentum."
        : "Lower values suggest weaker or negative momentum.";

    // Interpret AO
    indicatorData[coin]["AO"].interpretation = ao > 0
        ? "A positive value indicates bullish momentum."
        : "A negative value would indicate bearish momentum.";

    // Interpret CCI
    indicatorData[coin]["CCI (20)"].interpretation = cci > 100
        ? "CCI above 100 suggests overbought conditions."
        : "CCI below 100 suggests oversold conditions.";

    // Interpret Stochastic %K
    indicatorData[coin]["Stoch (14,3,3) %K"].interpretation = stochK > 80
        ? "Values above 80 suggest overbought conditions."
        : "Values below 20 suggest oversold conditions.";

    // Interpret Stochastic %D
    indicatorData[coin]["Stoch (14,3,3) %D"].interpretation = "Crossings can indicate potential reversals.";

    // Interpret MACD Level
    indicatorData[coin]["MACD (12,26) Level"].interpretation = macdLevel > 0
        ? "A positive level indicates bullish momentum."
        : "A negative level indicates bearish momentum.";

    // Interpret MACD
    indicatorData[coin]["MACD (12,26)"].interpretation = macd > 0
        ? "Signal line below MACD may suggest a potential reversal."
        : "Signal line above MACD may suggest a potential reversal.";

    // Store the analyzed data in the global analysis array
    analysis.push(indicatorData);

    // Return the indicator data
    return indicatorData;
}

// Function to process rows based on specified criteria
function processRows(rows, bypass, sliceIndex) {

    // Iterate through the rows
    rows.forEach(function (row) {
        // Get all the cells in this row
        var cells = row.querySelectorAll("td");

        // Extract the symbol and check if it's one of the interested symbols
        var coinSymbol = cells[0].textContent.trim().slice(0, sliceIndex).toUpperCase();
        if (!interestedSymbols.includes(coinSymbol)) {
            return; // Skip this row if the symbol is not in the list
        }

        // Check if Tech Rating and MA Rating are either Strong Buy or Buy
        var techRating = cells[2].textContent.trim();
        var maRating = cells[3].textContent.trim();
        var osRating = cells[4].textContent.trim();

        if (
            bypass == true ||
            ((techRating === "Buy" || techRating === "Strong buy") &&
                (maRating === "Buy" || maRating === "Strong buy") &&
                (osRating === "Buy" || osRating === "Strong buy"))
        ) {
            // Initialize an object to store the data for this row
            var rowData = {
                Coin: cells[0].textContent.trim().slice(0, sliceIndex).toUpperCase(),
                "RSI (14)": cells[5].textContent.trim(),
                "Mom (10)": cells[6].textContent.trim(),
                AO: cells[7].textContent.trim(),
                "CCI (20)": cells[8].textContent.trim(),
                "Stoch (14,3,3) %K": cells[9].textContent.trim(),
                "Stoch (14,3,3) %D": cells[10].textContent.trim(),
                "MACD (12,26) Level": cells[11].textContent.trim(),
                "MACD (12,26) Signal": cells[12].textContent.trim(),
            };

            // Convert the rowData object to a string and append it to dataText
            var element = row.querySelector(
                ".apply-common-tooltip.tickerNameBox-GrtoTeat.tickerName-GrtoTeat"
            );
            var href = element
                ? element.href
                : "No element found with the specified classes";
            var link =
                cells[0].textContent.trim().slice(0, sliceIndex).toUpperCase() +
                " " +
                href +
                "\n";

            // Analyze indicators for the current row
            analyzeIndicators(
                rowData["Coin"],
                rowData["RSI (14)"],
                rowData["Mom (10)"],
                rowData["AO"],
                rowData["CCI (20)"],
                rowData["Stoch (14,3,3) %K"],
                rowData["Stoch (14,3,3) %D"],
                rowData["MACD (12,26) Level"],
                rowData["MACD (12,26) Signal"]
            );

            // Store the link in the indicator data
            indicatorData[rowData["Coin"]]["link"] = link;

        }
    });

    // Return whether any row matched the criteria
    return ;
}

// Function to extract data from the table
function extractDataFromTable(bypass = false) {
    // Get all the rows in the table body
    var rows = document.querySelectorAll(
        ".stretch-gZJAyxim > table:nth-child(1) tbody tr"
    );

    // Process rows for different slice indices
    processRows(rows, bypass, 3);
    processRows(rows, bypass, 4);


    // Return whether any row was found based on the conditions
    return ;
}

function return_analysis(){
    console.log(analysis);
    return analysis;
}
    

// Clear the console and extract data from the table
clear();
extractDataFromTable(bypass = false);
return_analysis();
