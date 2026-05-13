export class FindRoomDetailQuery {
  constructor(
    public readonly id: string,
    public readonly publicView = false,
  ) {}
}
