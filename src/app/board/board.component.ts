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
  private DELAY_MS: number = 100
  private firstMove: boolean = true
  public board: number[][] = []
  public turn: number = 1
  public gameOver: boolean = false
  public canvas = document.getElementById('boardCanvas') as HTMLCanvasElement
  public textInfo = 'Player 1 turn'
  public lastMove: number[] = []
  public winCoords: number[][] = []

  ngOnInit() {
    this.createBoard()
    this.updateCanvas()
    this.canvas.addEventListener('click', this.mouseClick, false)
    this.canvas.addEventListener('mousemove', this.mouseMove, false)
    this.canvas.addEventListener('mouseout', this.mouseOut, false)
    if (this.boardSize === 19) {
      this.FIELD_SIZE = 40
    }
    setTimeout(() => {
      this.nextTurn()
    }, this.DELAY_MS)
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
        let highlight = false
        for (let k = 0; k < this.winCoords.length; k++) {
          if (i === this.winCoords[k][0] && j === this.winCoords[k][1]) {
            highlight = true
          }
        }
        if (i === this.lastMove[0] && j === this.lastMove[1]) {
          highlight = true
        }

        if (highlight) {
          ctx.beginPath()
          ctx.fillStyle = 'rgba(255, 0, 0, 0.5)'
          ctx.rect(this.FIELD_SIZE * i, this.FIELD_SIZE * j, this.FIELD_SIZE, this.FIELD_SIZE)
          ctx.fill()
        }

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
        this.board[xGrid][yGrid] = this.turn
        this.lastMove = [xGrid, yGrid]
        this.firstMove = false
        this.turn = this.turn === 1 ? 2 : 1
        this.updateCanvas()
        this.textInfo = this.turn === 1 ? 'Player 1 turn' : 'Player 2 turn'
        this.checkWin()
        this.checkDraw()

        setTimeout(() => {
          this.nextTurn()
        }, this.DELAY_MS)
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
          let coords = [[i, j]]

          let count = 1 // count of consecutive cells with the same color
          let x = i + dx
          let y = j + dy

          while (x >= 0 && x < this.boardSize && y >= 0 && y < this.boardSize && this.board[x][y] === color) {
            coords.push([x, y])
            count++
            x += dx
            y += dy
          }

          x = i - dx
          y = j - dy

          while (x >= 0 && x < this.boardSize && y >= 0 && y < this.boardSize && this.board[x][y] === color) {
            coords.push([x, y])
            count++
            x -= dx
            y -= dy
          }

          if (count === 5) {
            this.gameOver = true
            this.textInfo = `Player ${color} wins!`
            this.winCoords = coords
            setTimeout(() => {
              alert(`Player ${color} wins!`)
            }, this.DELAY_MS)
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
      }, this.DELAY_MS)
    }
  }

  public nextTurn(): void {
    if (!this.gameOver) {
      const player = this.turn === 1 ? this.player1 : this.player2
      if (player !== 'Human') {
        if (player === 'aiEasy') {
          this.ai(2, 1)
        } else if (player === 'aiMedium') {
          this.ai(2, 2)
        } else if (player === 'aiHard') {
          this.ai(3, 2)
        } else if (player === 'aiImpossible') {
          this.ai(4, 1)
        }
      }
    }
  }

  public ai(depth: number, maxDistance: number): void {
    const ai = new AI('easy', this.board, this.boardSize, this.turn, depth, this.firstMove, maxDistance)

    let length = ai.setup()
    for (let i = 0; i < length; i++) {
      let percent = ai.nextMove()
      console.log(percent)
    }
    const newBoard = ai.finish()

    const oldBoard = this.board
    this.board = newBoard
    this.firstMove = false

    for (let i = 0; i < this.boardSize; i++) {
      for (let j = 0; j < this.boardSize; j++) {
        if (this.board[i][j] !== oldBoard[i][j]) {
          this.lastMove = [i, j]
          break
        }
      }
    }

    this.turn = this.turn === 1 ? 2 : 1
    this.updateCanvas()

    this.textInfo = this.turn === 1 ? 'Player 1 turn' : 'Player 2 turn'
    this.checkWin()
    this.checkDraw()

    setTimeout(() => {
      this.nextTurn()
    }, this.DELAY_MS)
  }

  public mouseMove = (e: MouseEvent): void => {
    if (this.gameOver || !this.isHumanTurn) return
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

class AI {
  private difficulty: string
  private board: number[][]
  private boardSize: number
  private turn: number
  private opponentTurn: number
  private maxDepth: number
  private firstMove: boolean
  private indexDepth = 0
  private MAX_DISTANCE = 2

  constructor(difficulty: string, board: number[][], boardSize: number, turn: number, maxDepth: number, isFirstMove: boolean, maxDistance: number) {
    this.difficulty = difficulty
    this.board = board
    this.boardSize = boardSize
    this.turn = turn
    this.opponentTurn = turn === 1 ? 2 : 1
    this.maxDepth = maxDepth
    this.firstMove = isFirstMove
    this.MAX_DISTANCE = maxDistance
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

  private getNiceEmptyCells(board: number[][], color: number): number[][] {
    let emptyCells = this.getEmptyCells(board)
    let niceEmptyCells: number[][] = []
    let remainingEmptyCells: any = []
    emptyCells.forEach((cell) => {
      board[cell[0]][cell[1]] = color
      if (!this.tooFarAway(JSON.parse(JSON.stringify(board)), cell, this.MAX_DISTANCE) || this.firstMove) {
        if (this.checkWin(board) === color) {
          niceEmptyCells.unshift(cell)
        } else {
          let score = 0
          let points = this.calculatePoints(board)
          if (points[0] > 90 && color === this.opponentTurn) {
            score = points[0]
          } else if (points[1] > 90 && color === this.turn) {
            score = -points[1]
          } else {
            score = points[0] - points[1]
          }
          //niceEmptyCells.push(cell)
          remainingEmptyCells.push([...cell, score])
        }
      }
      board[cell[0]][cell[1]] = 0
    })

    remainingEmptyCells.sort((a: any, b: any) => b[2] - a[2])
    remainingEmptyCells.forEach((cell: any) => {
      niceEmptyCells.push([cell[0], cell[1]])
    })

    return niceEmptyCells
  }

  private tooFarAway(board: number[][], cell: number[], maxDistance: number): boolean {
    for (let i = -maxDistance; i <= maxDistance; i++) {
      for (let j = -maxDistance; j <= maxDistance; j++) {
        if (i === 0 && j === 0) continue
        if (cell[0] + i >= 0 && cell[0] + i < this.boardSize && cell[1] + j >= 0 && cell[1] + j < this.boardSize) {
          if (board[cell[0] + i][cell[1] + j] !== 0) {
            return false
          }
        }
      }
    }
    return true
  }

  private calculatePoints(board: number[][]): [number, number] {
    let blocks = this.getBlocks(board)

    return [this.getPointsFromBlocks(blocks[0]), this.getPointsFromBlocks(blocks[1])]
  }

  private getBlocks(board: number[][]): [any, any, any, any] {
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

    let yourNiceMoves: any[] = []
    let opponentNiceMoves: any[] = []

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
          let potentiallyGoodMoves = []

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
          } else {
            potentiallyGoodMoves.push([x, y])
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
          } else {
            potentiallyGoodMoves.push([x, y])
          }

          if (color === this.turn) {
            if (count >= 5) {
              yourBlocks.b6plus++
            } else if (count === 5) {
              yourBlocks.b5++
            } else if (count === 4) {
              if (walls === 0) {
                yourBlocks.b4_0w++
                potentiallyGoodMoves.forEach((move) => {
                  yourNiceMoves.push(move)
                })
              } else if (walls === 1) {
                yourBlocks.b4_1w++
                potentiallyGoodMoves.forEach((move) => {
                  yourNiceMoves.push(move)
                })
              } else if (walls === 2) {
                yourBlocks.b4_2w++
              }
            } else if (count === 3) {
              if (walls === 0) {
                yourBlocks.b3_0w++
                potentiallyGoodMoves.forEach((move) => {
                  yourNiceMoves.push(move)
                })
              } else if (walls === 1) {
                yourBlocks.b3_1w++
                potentiallyGoodMoves.forEach((move) => {
                  yourNiceMoves.push(move)
                })
              } else if (walls === 2) {
                yourBlocks.b3_2w++
              }
            } else if (count === 2) {
              if (walls === 0) {
                yourBlocks.b2_0w++
                potentiallyGoodMoves.forEach((move) => {
                  yourNiceMoves.push(move)
                })
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
                potentiallyGoodMoves.forEach((move) => {
                  opponentNiceMoves.push(move)
                })
              } else if (walls === 1) {
                opponentBlocks.b4_1w++
                potentiallyGoodMoves.forEach((move) => {
                  opponentNiceMoves.push(move)
                })
              } else if (walls === 2) {
                opponentBlocks.b4_2w++
              }
            } else if (count === 3) {
              if (walls === 0) {
                opponentBlocks.b3_0w++
                potentiallyGoodMoves.forEach((move) => {
                  opponentNiceMoves.push(move)
                })
              } else if (walls === 1) {
                opponentBlocks.b3_1w++
                potentiallyGoodMoves.forEach((move) => {
                  opponentNiceMoves.push(move)
                })
              } else if (walls === 2) {
                opponentBlocks.b3_2w++
              }
            } else if (count === 2) {
              if (walls === 0) {
                opponentBlocks.b2_0w++
                potentiallyGoodMoves.forEach((move) => {
                  opponentNiceMoves.push(move)
                })
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

    return [yourBlocks, opponentBlocks, yourNiceMoves, opponentNiceMoves]
  }

  private getPointsFromBlocks(blocks: any): number {
    let points = 0
    if (blocks.b5 > 0) {
      points = 100
    } else if (blocks.b4_0w > 0) {
      points = 90
    } else if (blocks.b4_1w > 1) {
      points = 80
    } else if (blocks.b3_0w > 2) {
      points = 70
    } else if (blocks.b3_0w > 1) {
      points = 60
    } else if (blocks.b3_0w > 0) {
      points = 50
    } else if (blocks.b4_1w > 0) {
      points = 40
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

  private minimax(board: number[][], depth: number, alpha: number, beta: number, isMaximizing: boolean): number {
    this.indexDepth++
    if (this.indexDepth % 1000000 === 0) {
      console.log(this.indexDepth)
    }

    let result = this.checkWin(board)
    if (result !== 0) {
      return result === this.turn ? 1000 : -1000
    }

    if (this.checkDraw(board)) {
      return 0
    }

    let points = this.calculatePoints(board)
    if (points[0] > 90 && !isMaximizing) {
      return points[0]
    } else if (points[1] > 90 && isMaximizing) {
      return -points[1]
    }

    if (depth === this.maxDepth) {
      return points[0] - points[1]
    }

    if (isMaximizing) {
      let bestScore = -Infinity
      const emptyCells = this.getNiceEmptyCells(board, this.turn)
      for (const [i, j] of emptyCells) {
        board[i][j] = this.turn
        let score = this.minimax(JSON.parse(JSON.stringify(board)), depth + 1, alpha, beta, false)
        board[i][j] = 0
        bestScore = Math.max(score, bestScore)
        alpha = Math.max(alpha, score)
        if (beta <= alpha || bestScore === 1000) {
          break
        }
      }
      return bestScore
    } else {
      let bestScore = Infinity
      const emptyCells = this.getNiceEmptyCells(board, this.opponentTurn)
      for (const [i, j] of emptyCells) {
        board[i][j] = this.opponentTurn
        let score = this.minimax(JSON.parse(JSON.stringify(board)), depth + 1, alpha, beta, true)
        board[i][j] = 0
        bestScore = Math.min(score, bestScore)
        beta = Math.min(beta, score)
        if (beta <= alpha || bestScore === -1000) {
          break
        }
      }
      return bestScore
    }
  }

  private newBoard: number[][] = []
  private emptyCells: number[][] = []
  private emptyCellsIndex: number = 0
  private bestScore: number = -Infinity
  private move: number[] = []

  nextMove(): string {
    let board = JSON.parse(JSON.stringify(this.board))
    let [i, j] = this.emptyCells[this.emptyCellsIndex]

    board[i][j] = this.turn
    let score = this.minimax(JSON.parse(JSON.stringify(board)), 0, -Infinity, Infinity, false)
    board[i][j] = 0

    if (score > this.bestScore) {
      this.bestScore = score
      this.move = [i, j]
    }
    this.emptyCellsIndex++

    // round to 0 decimal places
    //return `${(this.emptyCellsIndex / this.emptyCells.length) * 100}%`
    return `${Math.round((this.emptyCellsIndex / this.emptyCells.length) * 100)}%`
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

  public setup(): number {
    this.indexDepth = 0
    this.newBoard = this.copyBoard(this.board)

    if (this.firstMove) {
      this.firstMove = false
      this.emptyCells = [[(this.boardSize - 1) / 2, (this.boardSize - 1) / 2]]
    } else {
      this.emptyCells = this.getNiceEmptyCells(this.board, this.turn)
    }

    return this.emptyCells.length
  }

  public getRandomEmptyCell(board: number[][], turn: number): void {
    this.move = [this.getRandomInt(this.boardSize), this.getRandomInt(this.boardSize)]
  }

  public getRandomInt(max: number): number {
    return Math.floor(Math.random() * max)
  }

  public finish(): number[][] {
    this.newBoard[this.move[0]][this.move[1]] = this.turn
    console.log('move', this.move)
    return this.newBoard
  }
}
