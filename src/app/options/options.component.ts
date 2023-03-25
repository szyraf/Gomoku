import { Component, Output, EventEmitter } from '@angular/core'

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.css']
})
export class OptionsComponent {
  public player1: string = ''
  public player2: string = ''
  public boardSize: number = 0

  @Output() public startGameEvent = new EventEmitter()

  public updateValues(): void {
    this.player1 = (document.querySelector('input[name="player1"]:checked') as HTMLInputElement).value
    this.player2 = (document.querySelector('input[name="player2"]:checked') as HTMLInputElement).value
    this.boardSize = parseInt((document.querySelector('input[name="boardSize"]:checked') as HTMLInputElement).value)
  }

  public startGame(): void {
    this.updateValues()
    this.startGameEvent.emit({
      player1: this.player1,
      player2: this.player2,
      boardSize: this.boardSize
    })
  }
}
