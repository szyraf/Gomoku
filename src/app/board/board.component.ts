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
  public gameOver: boolean = false
  public canvas = document.getElementById('boardCanvas') as HTMLCanvasElement
  public textInfo = 'Player 1 turn'

  ngOnInit() {
    this.createBoard()
    this.updateCanvas()
    this.canvas.addEventListener('click', this.mouseClick, false)
    this.canvas.addEventListener('mousemove', this.mouseMove, false)
    this.canvas.addEventListener('mouseout', this.mouseOut, false)
    if (this.boardSize === 19) {
      this.FIELD_SIZE = 40
    }
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
    if (this.isHumanTurn && !this.gameOver) {
      const rect = this.canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const xGrid = Math.floor(x / this.FIELD_SIZE)
      const yGrid = Math.floor(y / this.FIELD_SIZE)
      if (this.board[xGrid][yGrid] !== 1 && this.board[xGrid][yGrid] !== 2) {
        this.board[xGrid][yGrid] = this.turn === 1 ? 1 : 2
        this.turn = this.turn === 1 ? 2 : 1
        this.updateCanvas()
        this.textInfo = this.turn === 1 ? 'Player 1 turn' : 'Player 2 turn'
        this.checkWin()
        this.checkDraw()

        this.nextTurn()
      }
    }
  }

  public get isHumanTurn(): boolean {
    return (this.turn === 1 && this.player1 === 'Human') || (this.turn === 2 && this.player2 === 'Human')
  }

  public checkWin(): void {
    let win = false
    let winColor = 0
    for (let i = 0; i < this.boardSize; i++) {
      for (let j = 0; j < this.boardSize; j++) {
        if (this.board[i][j] !== 0) {
          if (i + 4 < this.boardSize) {
            if (this.board[i][j] === this.board[i + 1][j] && this.board[i][j] === this.board[i + 2][j] && this.board[i][j] === this.board[i + 3][j] && this.board[i][j] === this.board[i + 4][j]) {
              if (i + 5 < this.boardSize) {
                if (this.board[i][j] !== this.board[i + 5][j]) {
                  win = true
                  winColor = this.board[i][j]
                }
              } else if (i - 1 >= 0) {
                if (this.board[i][j] !== this.board[i - 1][j]) {
                  win = true
                  winColor = this.board[i][j]
                }
              } else {
                win = true
                winColor = this.board[i][j]
              }
            }
          }
          if (j + 4 < this.boardSize) {
            if (this.board[i][j] === this.board[i][j + 1] && this.board[i][j] === this.board[i][j + 2] && this.board[i][j] === this.board[i][j + 3] && this.board[i][j] === this.board[i][j + 4]) {
              if (j + 5 < this.boardSize) {
                if (this.board[i][j] !== this.board[i][j + 5]) {
                  win = true
                  winColor = this.board[i][j]
                }
              } else if (j - 1 >= 0) {
                if (this.board[i][j] !== this.board[i][j - 1]) {
                  win = true
                  winColor = this.board[i][j]
                }
              } else {
                win = true
                winColor = this.board[i][j]
              }
            }
          }
          if (i + 4 < this.boardSize && j + 4 < this.boardSize) {
            if (this.board[i][j] === this.board[i + 1][j + 1] && this.board[i][j] === this.board[i + 2][j + 2] && this.board[i][j] === this.board[i + 3][j + 3] && this.board[i][j] === this.board[i + 4][j + 4]) {
              if (i + 5 < this.boardSize && j + 5 < this.boardSize) {
                if (this.board[i][j] !== this.board[i + 5][j + 5]) {
                  win = true
                  winColor = this.board[i][j]
                }
              } else if (i - 1 >= 0 && j - 1 >= 0) {
                if (this.board[i][j] !== this.board[i - 1][j - 1]) {
                  win = true
                  winColor = this.board[i][j]
                }
              } else {
                win = true
                winColor = this.board[i][j]
              }
            }
          }
          if (i - 4 >= 0 && j + 4 < this.boardSize) {
            if (this.board[i][j] === this.board[i - 1][j + 1] && this.board[i][j] === this.board[i - 2][j + 2] && this.board[i][j] === this.board[i - 3][j + 3] && this.board[i][j] === this.board[i - 4][j + 4]) {
              if (i - 5 >= 0 && j + 5 < this.boardSize) {
                if (this.board[i][j] !== this.board[i - 5][j + 5]) {
                  win = true
                  winColor = this.board[i][j]
                }
              } else if (i + 1 < this.boardSize && j - 1 >= 0) {
                if (this.board[i][j] !== this.board[i + 1][j - 1]) {
                  win = true
                  winColor = this.board[i][j]
                }
              } else {
                win = true
                winColor = this.board[i][j]
              }
            }
          }
        }
      }
    }
    if (win) {
      this.gameOver = true
      this.textInfo = `Player ${winColor} wins!`
      setTimeout(() => {
        alert(`Player ${winColor} wins!`)
      }, 10)
    }
  }

  public checkDraw(): void {
    let draw = true
    for (let i = 0; i < this.boardSize; i++) {
      for (let j = 0; j < this.boardSize; j++) {
        if (this.board[i][j] === 0) {
          draw = false
        }
      }
    }
    if (draw) {
      this.gameOver = true
      this.textInfo = 'Draw!'
      setTimeout(() => {
        alert('Draw!')
      }, 10)
    }
  }

  public nextTurn(): void {
    if (!this.gameOver) {
      if (this.turn === 1 && this.player1 !== 'Human') {
        if (this.player1 === 'aiEasy') {
          this.aiEasy()
        } /*else if (this.player1 === 'aiMedium') {
          this.aiMedium()
        } else if (this.player1 === 'aiHard') {
          this.aiHard()
        } else if (this.player1 === 'aiImpossible') {
          this.aiImpossible()
        }*/
      } else if (this.turn === 2 && this.player2 !== 'Human') {
        if (this.player2 === 'aiEasy') {
          this.aiEasy()
        } /*else if (this.player2 === 'aiMedium') {
          this.aiMedium()
        } else if (this.player2 === 'aiHard') {
          this.aiHard()
        } else if (this.player2 === 'aiImpossible') {
          this.aiImpossible()
        }*/
      }
    }
  }

  // use AI class to get the move
  public aiEasy(): void {
    const ai = new AI('easy', this.board, this.boardSize, this.turn)
    const newBoard = ai.makeAIMove()
    this.board = newBoard
    this.turn = this.turn === 1 ? 2 : 1
    this.checkWin()
    this.checkDraw()

    this.nextTurn()
  }

  public mouseMove = (e: MouseEvent): void => {
    if (this.gameOver) return
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

// easy, medium, hard or impossible
// minmax algorithm
class AI {
  private difficulty: string
  private board: number[][]
  private boardSize: number
  private turn: number
  private maxDepth: number

  constructor(difficulty: string, board: number[][], boardSize: number, turn: number) {
    this.difficulty = difficulty
    this.board = board
    this.boardSize = boardSize
    this.turn = turn
    this.maxDepth = 2
  }

  private checkWin(board: number[][]): number {
    let win = false
    let winColor = 0
    for (let i = 0; i < this.boardSize; i++) {
      for (let j = 0; j < this.boardSize; j++) {
        if (board[i][j] !== 0) {
          if (i + 4 < this.boardSize) {
            if (board[i][j] === board[i + 1][j] && board[i][j] === board[i + 2][j] && board[i][j] === board[i + 3][j] && board[i][j] === board[i + 4][j]) {
              if (i + 5 < this.boardSize) {
                if (board[i][j] !== board[i + 5][j]) {
                  win = true
                  winColor = board[i][j]
                }
              } else if (i - 1 >= 0) {
                if (board[i][j] !== board[i - 1][j]) {
                  win = true
                  winColor = board[i][j]
                }
              } else {
                win = true
                winColor = board[i][j]
              }
            }
          }
          if (j + 4 < this.boardSize) {
            if (board[i][j] === board[i][j + 1] && board[i][j] === board[i][j + 2] && board[i][j] === board[i][j + 3] && board[i][j] === board[i][j + 4]) {
              if (j + 5 < this.boardSize) {
                if (board[i][j] !== board[i][j + 5]) {
                  win = true
                  winColor = board[i][j]
                }
              } else if (j - 1 >= 0) {
                if (board[i][j] !== board[i][j - 1]) {
                  win = true
                  winColor = board[i][j]
                }
              } else {
                win = true
                winColor = board[i][j]
              }
            }
          }
          if (i + 4 < this.boardSize && j + 4 < this.boardSize) {
            if (board[i][j] === board[i + 1][j + 1] && board[i][j] === board[i + 2][j + 2] && board[i][j] === board[i + 3][j + 3] && board[i][j] === board[i + 4][j + 4]) {
              if (i + 5 < this.boardSize && j + 5 < this.boardSize) {
                if (board[i][j] !== board[i + 5][j + 5]) {
                  win = true
                  winColor = board[i][j]
                }
              } else if (i - 1 >= 0 && j - 1 >= 0) {
                if (board[i][j] !== board[i - 1][j - 1]) {
                  win = true
                  winColor = board[i][j]
                }
              } else {
                win = true
                winColor = board[i][j]
              }
            }
          }
          if (i + 4 < this.boardSize && j - 4 >= 0) {
            if (board[i][j] === board[i + 1][j - 1] && board[i][j] === board[i + 2][j - 2] && board[i][j] === board[i + 3][j - 3] && board[i][j] === board[i + 4][j - 4]) {
              if (i + 5 < this.boardSize && j - 5 >= 0) {
                if (board[i][j] !== board[i + 5][j - 5]) {
                  win = true
                  winColor = board[i][j]
                }
              } else if (i - 1 >= 0 && j + 1 < this.boardSize) {
                if (board[i][j] !== board[i - 1][j + 1]) {
                  win = true
                  winColor = board[i][j]
                }
              } else {
                win = true
                winColor = board[i][j]
              }
            }
          }
        }

        if (win) {
          if (winColor === 1) {
            return 1
          } else {
            return 2
          }
        }
      }
    }
    return 0
  }

  private checkDraw(board: number[][]): boolean {
    for (let i = 0; i < this.boardSize; i++) {
      for (let j = 0; j < this.boardSize; j++) {
        if (board[i][j] === 0) {
          return false
        }
      }
    }
    return true
  }

  private howMuch4empty(board: number[][]): number {
    let count = 0
    for (let i = 0; i < this.boardSize; i++) {
      for (let j = 0; j < this.boardSize; j++) {
        if (i + 4 < this.boardSize) {
          if (board[i + 1][j] === 0 && board[i + 2][j] === 0 && board[i + 3][j] === 0 && board[i + 4][j] === 0) {
            if (i + 5 < this.boardSize) {
              if (board[i + 5][j] === 0) {
                if (i - 1 >= 0) {
                  if (board[i - 1][j] === 0) {
                    count++
                  }
                }
              }
            }
          }
        }
      }
    }
    return count
  }

  // 4 empty is [blank, player1, player1, player1, player1, blank]
  // 3 empty is [blank, player1, player1, player1, blank]

  // (player 2 can be also be a wall)
  // 4 one side is [blank, player1, player1, player1, player1, player2] or [player2, player1, player1, player1, player1, blank]
  // 3 one side is [blank, player1, player1, player1, player2] or [player2, player1, player1, player1, blank]

  // 4 both sides is [player2, player1, player1, player1, player1, player2]
  // 3 both sides is [player2, player1, player1, player1, player2]

  // - points for opponent
  // if 1 or more x 4 empty in a row, return 10
  // if 2 or more x 3 empty in a row, return 10
  // if 2 or more x 3 one side in a row, return 9

  /*
  private calculatePoints(board: number[][]): number {
    let points = 0
  }
  */

  private minmax(board: number[][], depth: number, alpha: number, beta: number, isMaximizing: boolean): number {
    //console.log('minmax', depth)

    let result = this.checkWin(board)
    if (result !== 0) {
      return result === 1 ? 10 : -10
    }

    if (this.checkDraw(board)) {
      return 0
    }

    if (depth === this.maxDepth) {
      //return this.calculatePoints(board)
      // random from -1 to 1 float
      return Math.random() * 2 - 1
    }

    if (isMaximizing) {
      let bestScore = -Infinity
      for (let i = 0; i < this.boardSize; i++) {
        for (let j = 0; j < this.boardSize; j++) {
          if (board[i][j] === 0) {
            board[i][j] = 1
            let score = this.minmax(board, depth + 1, alpha, beta, false)
            board[i][j] = 0
            bestScore = Math.max(score, bestScore)
            alpha = Math.max(alpha, score)
            if (beta <= alpha) {
              break
            }
          }
        }
      }
      return bestScore
    } else {
      let bestScore = Infinity
      for (let i = 0; i < this.boardSize; i++) {
        for (let j = 0; j < this.boardSize; j++) {
          if (board[i][j] === 0) {
            board[i][j] = 2
            let score = this.minmax(board, depth + 1, alpha, beta, true)
            board[i][j] = 0
            bestScore = Math.min(score, bestScore)
            beta = Math.min(beta, score)
            if (beta <= alpha) {
              break
            }
          }
        }
      }
      return bestScore
    }
  }

  private findBestMove(board: number[][], depth: number): number[] {
    let bestScore = -Infinity
    let move: number[] = []
    for (let i = 0; i < this.boardSize; i++) {
      for (let j = 0; j < this.boardSize; j++) {
        if (board[i][j] === 0) {
          board[i][j] = 1
          let score = this.minmax(board, depth, -Infinity, Infinity, false)
          board[i][j] = 0
          if (score > bestScore) {
            bestScore = score
            move = [i, j]
          }
        }
      }
    }
    return move
  }

  private copyBoard(board: number[][]): number[][] {
    let newBoard: number[][] = []
    for (let i = 0; i < this.boardSize; i++) {
      newBoard.push([])
      for (let j = 0; j < this.boardSize; j++) {
        newBoard[i].push(board[i][j])
      }
    }
    return newBoard
  }

  public makeAIMove(): number[][] {
    let newBoard = this.copyBoard(this.board)
    let move = this.findBestMove(this.board, 0)
    newBoard[move[0]][move[1]] = 2

    return newBoard
  }
}
