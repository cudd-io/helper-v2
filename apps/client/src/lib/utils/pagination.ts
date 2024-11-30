export class PaginatedArray<T> {
	public items: T[];
	public pageSize: number;

	constructor(items: T[], { pageSize = 10 }) {
		this.items = items;
		this.pageSize = pageSize;
	}

	getTotalPages() {
		return Math.ceil(this.items.length / this.pageSize);
	}

	getItems(page: number) {
		return this.items.slice((page - 1) * this.pageSize, page * this.pageSize);
	}
}
