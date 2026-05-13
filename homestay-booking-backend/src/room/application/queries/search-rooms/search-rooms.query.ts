export class SearchRoomsQuery {
  constructor(
    public readonly homestayId: string,
    public readonly keyword: string,
  ) {}
}
