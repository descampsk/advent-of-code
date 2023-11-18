from math import prod

def pop(binary, num):
    begin = binary[:num]
    return begin, binary[num:]

def create_dict(version, type_id, value=None):
    return {"V": version, "T": type_id, "val": value}

def operation(num):
    return {
        0: sum,
        1: prod,
        2: min,
        3: max,
        5: lambda val: int(val[0]>val[1]),
        6: lambda val: int(val[0]<val[1]),
        7: lambda val: int(val[0]==val[1])
    }[num]

def decode_packet(arr):
    packets=None
    if not arr:
        return packets, arr
    version, arr = pop(arr, 3)
    version = int(version, 2)
    type_id, arr = pop(arr, 3)
    type_id = int(type_id, 2)
    if type_id == 4: # LITERAL VALUES
        again = '1'
        total_literal_value = ""
        while again=='1':
            again, arr = pop(arr, 1)
            literal_value, arr = pop(arr, 4)
            total_literal_value += literal_value
        total_literal_value = int(total_literal_value, 2)
        packets = create_dict(version, type_id, total_literal_value)
    else: # OPERATOR
        subpackets = []
        length_type_id, arr = pop(arr, 1)
        if length_type_id == '0':
            length_of_subpackets, arr = pop(arr, 15)
            length_of_subpackets = int(length_of_subpackets, 2)
            arr_literal_values, arr = pop(arr, length_of_subpackets)
            while arr_literal_values:
                new_packets, arr_literal_values = decode_packet(arr_literal_values)
                subpackets.append(new_packets)
        elif length_type_id == '1':
            nb_sub_packets, arr = pop(arr, 11)
            nb_sub_packets = int(nb_sub_packets, 2)
            for _ in range(nb_sub_packets):
                new_packets, sub_arr = decode_packet(arr)
                arr = sub_arr
                subpackets.append(new_packets)
        packets = create_dict(version, type_id, subpackets)
    return packets, arr

def compute_sum_version(packet):
    if not isinstance(packet['val'], list):
        return packet['V']
    else:
        return packet['V'] + sum(compute_sum_version(pack) for pack in packet['val'])

def evaluate_expression(packet):
    if not isinstance(packet['val'], list):
        return packet['val']
    else:
        return operation(packet['T'])([evaluate_expression(pack) for pack in packet['val']])
 

with open("16/data.txt") as f:
    hex = f.readline()
binary = ''.join([str(bin(int(c, 16))[2:].zfill(4)) for c in hex])
packet, arr = decode_packet(binary)
print('First puzzle sum versions', compute_sum_version(packet))
print('Second puzzle evaluation', evaluate_expression(packet))

"""
STUDY CASE
hex 620080001611562C8802118E34
bin 01100010000000001000000000000000000101100001000101010110001011001000100000000010000100011000111000110100
0110001 : operator type 11, version 3
rest bin : 0000000001000000000000000000101100001000101010110001011001000100000000010000100011000111000110100
00000000010 : nb_subpackets = 2
rest : 00000000000000000101100001000101010110001011001000100000000010000100011000111000110100 : len=86
    0000000 : operator type 15, version 0
    rest : 0000000000101100001000101010110001011001000100000000010000100011000111000110100 : len=79
    000000000010110: length_subpackets = 22
        rest : 0001000101010110001011001000100000000010000100011000111000110100 : len=64
        00010001010 : literal_value, version=0
        10110001011 : literal_value, version=5
rest : 001000100000000010000100011000111000110100 : len=42
    0010001 : operator type 11, version 1
    rest : 00000000010000100011000111000110100
    00000000010 : nb_subpackets = 2
        rest : 000100011000111000110100 : len=24
        00010001100 : literal_value, version 0
        01110001101 : literal_value, version 3
rest 00
"""
