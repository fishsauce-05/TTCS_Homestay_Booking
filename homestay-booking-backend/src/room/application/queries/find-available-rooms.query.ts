export class FindAvailableRoomsQuery {
  constructor(
    public readonly checkInDate: string,
    public readonly checkOutDate: string,
    public readonly minCapacity: number,
  ) {}
}
