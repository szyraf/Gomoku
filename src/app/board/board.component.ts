import { Component, OnInit, Input } from '@angular/core'

// TODO: 3x3 rule in AI to improve performance

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

        setTimeout(() => {
          this.nextTurn()
        }, 10)
      }
    }
  }

  public get isHumanTurn(): boolean {
    return (this.turn === 1 && this.player1 === 'Human') || (this.turn === 2 && this.player2 === 'Human')
  }

  public checkWin(): void {
    for (let i = 0; i < this.boardSize; i++) {
      for (let j = 0; j < this.boardSize; j++) {
        const color = this.board[i][j]
        if (color === 0) {
          continue // skip empty cells
        }
        const directions = [
          [0, 1], // right
          [1, 0], // down
          [1, 1], // diagonal down-right
          [-1, 1] // diagonal up-right
        ]

        for (const [dx, dy] of directions) {
          let count = 1 // count of consecutive cells with the same color
          let x = i + dx
          let y = j + dy

          while (x >= 0 && x < this.boardSize && y >= 0 && y < this.boardSize && this.board[x][y] === color) {
            count++
            x += dx
            y += dy
          }

          x = i - dx
          y = j - dy

          while (x >= 0 && x < this.boardSize && y >= 0 && y < this.boardSize && this.board[x][y] === color) {
            count++
            x -= dx
            y -= dy
          }

          if (count === 5) {
            this.gameOver = true
            this.textInfo = `Player ${color} wins!`
            setTimeout(() => {
              alert(`Player ${color} wins!`)
            }, 10)
            return
          }
        }
      }
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
      const player = this.turn === 1 ? this.player1 : this.player2
      if (player !== 'Human') {
        if (player === 'aiEasy') {
          this.aiEasy()
        } /*else if (player === 'aiMedium') {
          this.aiMedium()
        } else if (player === 'aiHard') {
          this.aiHard()
        } else if (player === 'aiImpossible') {
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
    this.updateCanvas()

    this.textInfo = this.turn === 1 ? 'Player 1 turn' : 'Player 2 turn'
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
    this.maxDepth = 3
  }

  private checkWin(board: number[][]): number {
    for (let i = 0; i < this.boardSize; i++) {
      for (let j = 0; j < this.boardSize; j++) {
        const color = board[i][j]
        if (color === 0) {
          continue
        }

        const directions = [
          [0, 1], // right
          [1, 0], // down
          [1, 1], // diagonal down-right
          [1, -1] // diagonal down-left
        ]

        for (const [dx, dy] of directions) {
          let count = 1
          let x = i + dx
          let y = j + dy

          while (x >= 0 && x < this.boardSize && y >= 0 && y < this.boardSize && board[x][y] === color) {
            count++
            x += dx
            y += dy
          }

          x = i - dx
          y = j - dy

          while (x >= 0 && x < this.boardSize && y >= 0 && y < this.boardSize && board[x][y] === color) {
            count++
            x -= dx
            y -= dy
          }

          if (count === 5) {
            return color
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

  private getEmptyCells(board: number[][]): number[][] {
    const emptyCells = []
    for (let i = 0; i < this.boardSize; i++) {
      for (let j = 0; j < this.boardSize; j++) {
        if (board[i][j] === 0) {
          emptyCells.push([i, j])
        }
      }
    }
    return emptyCells
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
  // if 1 or more x 4 one side in a row, return 8
  // if 2 or more x 2 empty in a row, return 7
  // if 2 or more x 2 one side in a row, return 6
  // if 1 or more x 3 empty in a row, return 5
  // if 1 or more x 3 one side in a row, return 4
  // if 1 or more x 2 empty in a row, return 3
  // if 1 or more x 2 one side in a row, return 2
  // if 1 or more x 1 empty in a row, return 1
  // if 1 or more x 1 one side in a row, return 0

  // the same with another player but with -10, -9, -8, -7, -6, -5, -4, -3, -2, -1

  private calculatePoints(board: number[][]): number {
    let points = 0

    let yourBlocks = {
      b6plus: 0,
      b5: 0,
      b4_0w: 0,
      b4_1w: 0,
      b4_2w: 0,
      b3_0w: 0,
      b3_1w: 0,
      b3_2w: 0,
      b2_0w: 0,
      b2_1w: 0,
      b2_2w: 0
    }

    let opponentBlocks = {
      b6plus: 0,
      b5: 0,
      b4_0w: 0,
      b4_1w: 0,
      b4_2w: 0,
      b3_0w: 0,
      b3_1w: 0,
      b3_2w: 0,
      b2_0w: 0,
      b2_1w: 0,
      b2_2w: 0
    }

    for (let i = 0; i < this.boardSize; i++) {
      for (let j = 0; j < this.boardSize; j++) {
        const color = board[i][j]
        if (color === 0) {
          continue
        }

        const directions = [
          [0, 1], // right
          [1, 0], // down
          [1, 1], // diagonal down-right
          [1, -1] // diagonal down-left
        ]

        for (const [dx, dy] of directions) {
          let count = 1
          let x = i + dx
          let y = j + dy

          let walls = 0

          while (x >= 0 && x < this.boardSize && y >= 0 && y < this.boardSize && board[x][y] === color) {
            count++
            x += dx
            y += dy
          }

          if (!(x >= 0 && x < this.boardSize && y >= 0 && y < this.boardSize && board[x][y] === 0)) {
            walls++
          }

          x = i - dx
          y = j - dy

          while (x >= 0 && x < this.boardSize && y >= 0 && y < this.boardSize && board[x][y] === color) {
            count++
            x -= dx
            y -= dy
          }

          if (!(x >= 0 && x < this.boardSize && y >= 0 && y < this.boardSize && board[x][y] === 0)) {
            walls++
          }

          if (color === (this.turn === 1 ? 1 : 2)) {
            if (count >= 5) {
              yourBlocks.b6plus++
            } else if (count === 5) {
              yourBlocks.b5++
            } else if (count === 4) {
              if (walls === 0) {
                yourBlocks.b4_0w++
              } else if (walls === 1) {
                yourBlocks.b4_1w++
              } else if (walls === 2) {
                yourBlocks.b4_2w++
              }
            } else if (count === 3) {
              if (walls === 0) {
                yourBlocks.b3_0w++
              } else if (walls === 1) {
                yourBlocks.b3_1w++
              } else if (walls === 2) {
                yourBlocks.b3_2w++
              }
            } else if (count === 2) {
              if (walls === 0) {
                yourBlocks.b2_0w++
              } else if (walls === 1) {
                yourBlocks.b2_1w++
              } else if (walls === 2) {
                yourBlocks.b2_2w++
              }
            }
          } else {
            if (count >= 5) {
              opponentBlocks.b6plus++
            } else if (count === 5) {
              opponentBlocks.b5++
            } else if (count === 4) {
              if (walls === 0) {
                opponentBlocks.b4_0w++
              } else if (walls === 1) {
                opponentBlocks.b4_1w++
              } else if (walls === 2) {
                opponentBlocks.b4_2w++
              }
            } else if (count === 3) {
              if (walls === 0) {
                opponentBlocks.b3_0w++
              } else if (walls === 1) {
                opponentBlocks.b3_1w++
              } else if (walls === 2) {
                opponentBlocks.b3_2w++
              }
            } else if (count === 2) {
              if (walls === 0) {
                opponentBlocks.b2_0w++
              } else if (walls === 1) {
                opponentBlocks.b2_1w++
              } else if (walls === 2) {
                opponentBlocks.b2_2w++
              }
            }
          }
        }
      }
    }

    if (this.getPointsFromBlocks(yourBlocks) > 9) {
      points = 10
    } else if (this.getPointsFromBlocks(opponentBlocks) > 9) {
      points = -9
    } else {
      points = this.getPointsFromBlocks(yourBlocks) - this.getPointsFromBlocks(opponentBlocks)
    }

    return points
  }

  getPointsFromBlocks(blocks: any): number {
    let points = 0
    if (blocks.b6plus > 0) {
      points = 10
    } else if (blocks.b5 > 0) {
      points = 10
    } else if (blocks.b4_0w > 0) {
      points = 10
    } else if (blocks.b4_1w > 1) {
      points = 10
    } else if (blocks.b3_0w > 2) {
      points = 10
    } else if (blocks.b3_0w > 1) {
      points = 9
    } else if (blocks.b3_0w > 0) {
      points = 8
    } else if (blocks.b4_1w > 0) {
      points = 7
    } else if (blocks.b4_2w > 4) {
      points = 6
    } else if (blocks.b2_0w > 3) {
      points = 6
    } else if (blocks.b4_2w > 3) {
      points = 5
    } else if (blocks.b2_0w > 2) {
      points = 5
    } else if (blocks.b4_2w > 2) {
      points = 4
    } else if (blocks.b3_1w > 2) {
      points = 4
    } else if (blocks.b2_0w > 1) {
      points = 4
    } else if (blocks.b4_2w > 1) {
      points = 3
    } else if (blocks.b3_1w > 0) {
      points = 3
    } else if (blocks.b2_0w > 0) {
      points = 3
    } else if (blocks.b4_2w > 0) {
      points = 2
    } else if (blocks.b3_2w > 0) {
      points = 2
    } else if (blocks.b2_1w > 0) {
      points = 2
    } else if (blocks.b2_2w > 0) {
      points = 1
    } else {
      points = 0
    }

    return points
  }

  private indexDepth = 0
  private minmax(board: number[][], depth: number, alpha: number, beta: number, isMaximizing: boolean): number {
    this.indexDepth++
    if (this.indexDepth % 1000000 === 0) {
      console.log(this.indexDepth)
    }

    let result = this.checkWin(board)
    if (result !== 0) {
      return result === 1 ? 10 : -10
    }

    if (this.checkDraw(board)) {
      return 0
    }

    if (depth === this.maxDepth) {
      // return this.calculatePoints(board)
      if (isMaximizing) {
        return -this.calculatePoints(board)
      } else {
        return this.calculatePoints(board)
      }
    }

    if (isMaximizing) {
      let bestScore = -Infinity
      const emptyCells = this.getEmptyCells(board)
      for (const [i, j] of emptyCells) {
        board[i][j] = 1
        let score = this.minmax(board, depth + 1, alpha, beta, false)
        board[i][j] = 0
        bestScore = Math.max(score, bestScore)
        alpha = Math.max(alpha, score)
        if (beta <= alpha) {
          break
        }

        let isEmpty7x7 = true
        for (let y2 = -3; y2 < 4; y2++) {
          for (let x2 = -3; x2 < 4; x2++) {
            if (!(x2 === 0 && y2 === 0)) {
              if (i + y2 >= 0 && i + y2 < 7 && j + x2 >= 0 && j + x2 < 7) {
                if (board[i + y2][j + x2] !== 0) {
                  isEmpty7x7 = false
                  break
                }
              }
            }
          }
        }
        if (isEmpty7x7) {
          break
        }
      }
      return bestScore
    } else {
      let bestScore = Infinity
      const emptyCells = this.getEmptyCells(board)
      for (const [i, j] of emptyCells) {
        board[i][j] = 2
        let score = this.minmax(board, depth + 1, alpha, beta, true)
        board[i][j] = 0
        bestScore = Math.min(score, bestScore)
        beta = Math.min(beta, score)
        if (beta <= alpha) {
          break
        }

        let isEmpty7x7 = true
        for (let y2 = -13; y2 < 14; y2++) {
          for (let x2 = -13; x2 < 14; x2++) {
            if (!(x2 === 0 && y2 === 0)) {
              if (i + y2 >= 0 && i + y2 < 7 && j + x2 >= 0 && j + x2 < 7) {
                if (board[i + y2][j + x2] === 1 || board[i + y2][j + x2] === 2) {
                  isEmpty7x7 = false
                  break
                }
              }
            }
          }
        }
        if (isEmpty7x7) {
          break
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
    console.log('bestScore', bestScore)

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
    this.indexDepth = 0
    let newBoard = this.copyBoard(this.board)
    let move = this.findBestMove(this.board, 0)
    newBoard[move[0]][move[1]] = 2

    return newBoard
  }
}
