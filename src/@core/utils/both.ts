import { FilterType, Market } from "../interfaces"; 

export const marketFilter = (type: FilterType, markets: Market[]) => {
  if (type === 'all') {
    return markets;
  } else if (type === 'today') {
    const now = new Date();
    return markets.filter(m => {
      const date = new Date(m.maturityDate);
      return now.getFullYear() === date.getFullYear() && now.getMonth() === date.getMonth() && now.getDate() === date.getDate();
    });
  } else if (type === 'in-1h') {
    const now = Date.now();
    return markets.filter(m => {
      const date = new Date(m.maturityDate).getTime();
      return 0 < (date - now) && (date - now) <= (60 * 60 * 1000);
    });
  } return [];
}

export const dateStr = (dateText: string) => {
  const date = new Date(dateText);
  return `${date.toLocaleString('en-US', {month: 'short', day: '2-digit'})}, ${date.getHours()}:${date.getHours().toString().padStart(2, '0')}`;
}

export const teamLogoUrl = (leagueName: string, teamName: string) => {
  const tname = teamName.toLocaleLowerCase().replaceAll(' ', '-');
  return `/logos/${leagueName}/${tname}.webp`;
}
