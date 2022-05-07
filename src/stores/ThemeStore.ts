import { makeAutoObservable } from 'mobx';

class Theme {
  _theme: string = 'light';

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  toggleTheme(): void {
    this._theme = this._theme === 'light' ? 'dark' : 'light';
  }
}

const theme = new Theme();
theme.toString = () => theme._theme;

export default theme;
