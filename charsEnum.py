class CharEnum:
    A = ['r2c0', 'r2c1', 'r2c2', 'r2c3', 'r3c4', 'r4c1', 'r4c2', 'r4c3', 'r4c4', 'r5c4', 'r4c4', 'r6c1', 'r6c2', 'r6c3',
         'r6c0', 'r5c0', 'r4c0']
    B = ['r0c0', 'r1c0', 'r2c0', 'r3c0', 'r4c0', 'r5c0', 'r6c0', 'r2c1', 'r2c2', 'r2c3', 'r3c4', 'r6c1', 'r6c2',
         'r6c3', 'r4c4', 'r5c4']
    C = ['r3c0', 'r4c0', 'r5c0', 'r2c1', 'r2c2', 'r2c3', 'r6c1', 'r6c2', 'r6c3']
    D = ['r0c4', 'r1c4', 'r2c4', 'r3c4', 'r4c4', 'r5c4', 'r2c1', 'r2c2', 'r2c3', 'r4c0', 'r5c0', 'r6c1', 'r6c2', 'r6c3',
         'r3c0']
    E = ['r2c1', 'r2c2', 'r2c3', 'r3c0', 'r3c4', 'r4c0', 'r4c1', 'r4c2',
         'r4c3', 'r4c4', 'r5c0', 'r6c1', 'r6c2', 'r6c3']
    F = ['r3c0', 'r3c1', 'r3c2', 'r0c1', 'r1c1', 'r2c1', 'r3c1', 'r4c1', 'r5c1', 'r6c1', 'r0c2']
    H = ['r0c0', 'r1c0', 'r2c0', 'r3c0', 'r4c0', 'r5c0', 'r6c0', 'r3c1', 'r3c2', 'r3c3', 'r4c3', 'r5c3', 'r6c3']
    I = ['r3c3', 'r4c3', 'r5c3', 'r6c3', 'r2c3']
    L = ['r0c0', 'r1c0', 'r2c0', 'r3c0', 'r4c0', 'r5c0', 'r6c1', 'r6c2', 'r6c3']
    M = ['r3c0', 'r4c0', 'r5c0', 'r6c0', 'r2c0', 'r2c1', 'r2c2', 'r2c3', 'r2c4', 'r3c2', 'r3c4',
         'r4c2', 'r5c2', 'r6c2', 'r4c4', 'r5c4', 'r6c4']
    N = ['r3c0', 'r4c0', 'r5c0', 'r6c0', 'r2c1', 'r2c2', 'r2c3', 'r3c3', 'r4c3', 'r5c3', 'r6c3', 'r2c0', 'r4c3']
    O = ['r2c1', 'r2c2', 'r2c3', 'r3c0', 'r3c4', 'r4c0', 'r4c4', 'r5c0',
         'r5c4', 'r6c1', 'r6c2', 'r6c3']
    R = ['r2c0', 'r3c0', 'r4c0', 'r5c0', 'r6c0', 'r2c0', 'r2c1', 'r2c2']
    S = ['r2c1', 'r2c2', 'r2c3', 'r3c0', 'r4c0', 'r4c1', 'r4c2', 'r5c3', 'r6c0', 'r6c1', 'r6c2']
    T = ['r0c1', 'r1c1', 'r2c1', 'r3c1', 'r4c1', 'r5c1', 'r6c1', 'r6c2', 'r2c2', 'r2c0']
    U = ['r2c0', 'r3c0', 'r4c0', 'r5c0', 'r6c0', 'r6c1', 'r6c2', 'r6c3', 'r3c3', 'r4c3', 'r5c3', 'r6c3', 'r2c3']
    V = ['r2c0', 'r3c0', 'r4c0', 'r5c1', 'r6c2', 'r5c3', 'r4c4', 'r3c4', 'r2c4']
    DASH = ['r6c0', 'r6c1', 'r6c2', 'r6c3', 'r6c4']


def get_array_from_letter(char):
    letter_dict = {'a': CharEnum.A, 'b': CharEnum.B, 'c': CharEnum.C, 'd': CharEnum.D, 'e': CharEnum.E, 'f': CharEnum.F,
                   'h': CharEnum.H, 'i': CharEnum.I, 'l': CharEnum.L, 'm': CharEnum.M, 'n': CharEnum.N, 'o': CharEnum.O,
                   'r': CharEnum.R, 's': CharEnum.S, 't': CharEnum.T, 'v': CharEnum.V, 'u': CharEnum.U,
                   '_': CharEnum.DASH}
    return letter_dict[char]
