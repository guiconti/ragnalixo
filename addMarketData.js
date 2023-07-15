const fs = require("fs");
const fs = require("fs");

const API_PREFIX = "https://api.ragnatales.com.br";
const MARKET_URL = "/market/item/history/detail?nameid=";
const LIST_URLS = [EQUIP_LIST_URL, CARD_LIST_URL, PET_LIST_URL, VISUAL_LIST_URL];

const headers = {
	Accept: "application/json",
	"Content-Type": "application/json",
	referer: "https://ragnatales.com.br/",
};

async function getMarketData() {
	const jsonData = JSON.parse(fs.readFileSync("items.json"));

	for (const item of jsonData.items) {
		const url = API_PREFIX + MARKET_URL + item.id;
		const response = await fetch(url, { headers });
		const data = await response.json();
		const dates = Objects.keys(data);
		
	}

	for (const listUrl of LIST_URLS) {
		let currentPage = 1;
		let totalPages = 999;
		while (currentPage < totalPages) {
			const url = API_PREFIX + listUrl + currentPage;
			const response = await fetch(url, { headers });
			const data = await response.json();
			totalPages = data.total_pages;
			currentPage++;

			for (let row of data.rows) {
				const item = {
					id: row.nameid,
					name: row.jname,
				};
				console.log(item);
				jsonData.items.push(item);
			}
		}
	}
	fs.writeFileSync("items.json", JSON.stringify(jsonData));
}

getMarketData();
