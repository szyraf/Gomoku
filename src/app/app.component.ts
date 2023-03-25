import { Component } from '@angular/core'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public isGameStarted: boolean = false
  public player1: string = ''
  public player2: string = ''
  public boardSize: number = 0

  startGame(values: any): void {
    console.log(values)
    this.player1 = values.player1
    this.player2 = values.player2
    this.boardSize = values.boardSize
    this.isGameStarted = true
  }
}
