export interface Player {
  id: string;
  username: string;

  level: number;
  xp: number;
  xpToNext: number;

  hp: number;
  maxHp: number;

  className: string;

  weapon: string;
  armor: string;

  gold: number;
  nd: number;
}