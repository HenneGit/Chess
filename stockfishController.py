from stockfish import Stockfish

stockfish = Stockfish("/home/henne/projects/python/website/dependencies/stockfish/Linux/stockfish_20011801_x64")
print(stockfish.get_board_visual())
stockfish.set_position(["c2c4"])
print(stockfish.get_board_visual())
print(stockfish.get_best_move())
