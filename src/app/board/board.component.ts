import { Component, OnInit, Input } from '@angular/core'

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent {
  @Input() public boardSize: number = 0
  @Input() public player1: string = ''
  @Input() public player2: string = ''
  private FIELD_SIZE: number = 50
  public board: number[][] = []
  public turn: number = 1
  public canvas = document.getElementById('boardCanvas') as HTMLCanvasElement

  ngOnInit() {
    this.createBoard()
    this.updateCanvas()
    this.canvas.addEventListener('click', this.mouseClick, false)
    this.canvas.addEventListener('mousemove', this.mouseMove, false)
    this.canvas.addEventListener('mouseout', this.mouseOut, false)
  }

  public createBoard(): void {
    for (let i = 0; i < this.boardSize; i++) {
      this.board.push([])
      for (let j = 0; j < this.boardSize; j++) {
        this.board[i].push(0)
      }
    }
  }

  public updateCanvas(): void {
    this.canvas = document.getElementById('boardCanvas') as HTMLCanvasElement
    const ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D
    this.canvas.width = this.boardSize * this.FIELD_SIZE
    this.canvas.height = this.boardSize * this.FIELD_SIZE
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    ctx.fillStyle = 'rgba(255, 192, 0, 0.5)'
    ctx.rect(0, 0, this.canvas.width, this.canvas.height)
    ctx.fill()

    ctx.strokeStyle = 'black'
    ctx.lineWidth = 2

    for (let i = 0; i < this.boardSize; i++) {
      for (let j = 0; j < this.boardSize; j++) {
        ctx.beginPath()
        ctx.moveTo(this.FIELD_SIZE * (i + 0.5), this.FIELD_SIZE * 0.5)
        ctx.lineTo(this.FIELD_SIZE * (i + 0.5), this.canvas.height - this.FIELD_SIZE * 0.5)
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(this.FIELD_SIZE * 0.5, this.FIELD_SIZE * (j + 0.5))
        ctx.lineTo(this.canvas.width - this.FIELD_SIZE * 0.5, this.FIELD_SIZE * (j + 0.5))
        ctx.stroke()
      }
    }
    for (let i = 0; i < this.boardSize; i++) {
      for (let j = 0; j < this.boardSize; j++) {
        if (this.board[i][j] === 1) {
          this.drawCircle(ctx, i, j, 'black', 1)
        } else if (this.board[i][j] === 2) {
          this.drawCircle(ctx, i, j, 'white', 1)
        } else if (this.board[i][j] === 3) {
          this.drawCircle(ctx, i, j, 'black', 0.7)
        } else if (this.board[i][j] === 4) {
          this.drawCircle(ctx, i, j, 'white', 0.7)
        }
      }
    }
  }

  public drawCircle(ctx: CanvasRenderingContext2D, i: number, j: number, color: string, alpha: number): void {
    ctx.beginPath()
    ctx.arc(this.FIELD_SIZE * (i + 0.5), this.FIELD_SIZE * (j + 0.5), this.FIELD_SIZE * 0.4, 0, 2 * Math.PI)
    ctx.fillStyle = color
    ctx.globalAlpha = alpha
    ctx.fill()
    ctx.globalAlpha = 1
  }

  public mouseClick = (e: MouseEvent): void => {
    if (this.isHumanTurn) {
      const rect = this.canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const xGrid = Math.floor(x / this.FIELD_SIZE)
      const yGrid = Math.floor(y / this.FIELD_SIZE)
      if (this.board[xGrid][yGrid] !== 1 && this.board[xGrid][yGrid] !== 2) {
        this.board[xGrid][yGrid] = this.turn === 1 ? 1 : 2
        this.turn = this.turn === 1 ? 2 : 1
        this.updateCanvas()
      }
    }
  }

  public get isHumanTurn(): boolean {
    return (this.turn === 1 && this.player1 === 'Human') || (this.turn === 2 && this.player2 === 'Human')
  }

  public mouseMove = (e: MouseEvent): void => {
    const rect = this.canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const xGrid = Math.floor(x / this.FIELD_SIZE) < 0 ? 0 : Math.floor(x / this.FIELD_SIZE)
    const yGrid = Math.floor(y / this.FIELD_SIZE) < 0 ? 0 : Math.floor(y / this.FIELD_SIZE)
    for (let i = 0; i < this.boardSize; i++) {
      for (let j = 0; j < this.boardSize; j++) {
        if (this.board[i][j] === 3 || this.board[i][j] === 4) {
          this.board[i][j] = 0
        }
      }
    }
    if (this.board[xGrid][yGrid] !== 1 && this.board[xGrid][yGrid] !== 2) {
      this.board[xGrid][yGrid] = this.turn === 1 ? 3 : 4
    }
    this.updateCanvas()
  }

  public mouseOut = (e: MouseEvent): void => {
    for (let i = 0; i < this.boardSize; i++) {
      for (let j = 0; j < this.boardSize; j++) {
        if (this.board[i][j] === 3 || this.board[i][j] === 4) {
          this.board[i][j] = 0
        }
      }
    }
    this.updateCanvas()
  }

  public reloadPage(): void {
    window.location.reload()
  }
}
