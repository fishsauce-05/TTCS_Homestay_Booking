export enum HomestayStatus {
  PENDING = 'pending',      // Chờ duyệt
  APPROVED = 'approved',    // Được duyệt
  REJECTED = 'rejected',    // Bị từ chối
  AVAILABLE = 'available',  // Có sẵn (cho thuê)
  UNAVAILABLE = 'unavailable', // Không có sẵn
  BLOCKED = 'blocked',      // Bị khóa
}
