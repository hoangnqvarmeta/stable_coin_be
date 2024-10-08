export enum QuickTimeFilterEnum {
  allTime = 'allTime',
  lastHour = 'lastHour',
  last6hours = 'last6hours',
  last24hours = 'last24hours',
  last7days = 'last7days',
  last30days = 'last30days',
  last90days = 'last90days',
}

export function getStartDateForQuicktimeFilter(
  sortType: QuickTimeFilterEnum,
): Date | null {
  const now = new Date();
  let startDate: Date | null = null;

  switch (sortType) {
    case QuickTimeFilterEnum.lastHour:
      startDate = new Date(now.getTime() - 1 * 60 * 60 * 1000); // 1 hour ago
      break;
    case QuickTimeFilterEnum.last6hours:
      startDate = new Date(now.getTime() - 6 * 60 * 60 * 1000); // 6 hours ago
      break;
    case QuickTimeFilterEnum.last24hours:
      startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 24 hours ago
      break;
    case QuickTimeFilterEnum.last7days:
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); // 7 days ago
      break;
    case QuickTimeFilterEnum.last30days:
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); // 30 days ago
      break;
    case QuickTimeFilterEnum.last90days:
      startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000); // 90 days ago
      break;
    default:
      startDate = null; // QuickTimeFilterEnum.allTime or unrecognized type, no filter is applied
  }

  return startDate;
}
