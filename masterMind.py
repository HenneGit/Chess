class Colors:
    RED = 'red'
    GREEN = 'green'
    YELLOW = 'yellow'
    PURPlE = 'purple'
    BLUE = 'blue'
    ORANGE = 'orange'


class Code:

    def __init__(self, colors):
        self.colors = colors

    def correct_color(self, code):
        correct_colors = 0
        for color in code.colors:
            if color in self.colors:
                correct_colors += 1

        return correct_colors

    def correct_position(self, code):
        correct_position = 0
        for i in range(len(code.colors)):
            if code.colors[i] == self.colors[i]:
                correct_position += 1

        return correct_position
