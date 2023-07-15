const fs = require("fs");
const fs = require("fs");

const API_PREFIX = "https://api.ragnatales.com.br";
const EQUIP_LIST_URL = "/database/items?rows_per_page=30&filters=%7B%22type%22:%22equip%22%7D&page=";
const CARD_LIST_URL = "/database/items?rows_per_page=30&filters=%7B%22type%22:%22card%22%7D&page=";
const PET_LIST_URL = "/database/items?rows_per_page=30&filters=%7B%22type%22:%22pet%22%7D&page=";
const VISUAL_LIST_URL = "/database/items?rows_per_page=30&filters=%7B%22type%22:%22visual%22%7D&page=";
const LIST_URLS = [EQUIP_LIST_URL, CARD_LIST_URL, PET_LIST_URL, VISUAL_LIST_URL];

const headers = {
	Accept: "application/json",
	"Content-Type": "application/json",
	referer: "https://ragnatales.com.br/",
};

async function getItemIds() {
	const jsonData = {
		items: [],
	};

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

getItemIds();
