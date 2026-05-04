# Converte WAV/MP3 -> arrays Arduino (NOTE_X + durations) usando pyin do librosa
# Adaptado pra aceitar WAV direto (sem precisar de ffmpeg/pydub)
# Uso: python audio_to_arduino.py <input.wav> [--tempo 120] [--max-size 32] [--method truncate|downsample]

import librosa
import numpy as np
import os
import sys

def extract_pitches(wav_file):
    y, sr = librosa.load(wav_file, sr=None)
    f0, voiced_flag, voiced_probs = librosa.pyin(
        y,
        fmin=librosa.note_to_hz('C4'),     # 261 Hz — buzzer não rende abaixo disso
        fmax=librosa.note_to_hz('C8'),     # 4186 Hz — captura sons agudos do Tamagotchi
        sr=sr,
        frame_length=2048,
        hop_length=256
    )
    times = librosa.times_like(f0, sr=sr, hop_length=256)
    pitches = f0[~np.isnan(f0)]
    times = times[~np.isnan(f0)]
    return pitches, times

def frequency_to_midi_note(frequency):
    return int(round(librosa.hz_to_midi(frequency)))

def midi_note_to_arduino_constant(midi_note):
    note_names = ['C', 'CS', 'D', 'DS', 'E', 'F', 'FS', 'G', 'GS', 'A', 'AS', 'B']
    octave = (midi_note // 12) - 1
    note_index = midi_note % 12
    return f'NOTE_{note_names[note_index]}{octave}'

def calculate_durations(times):
    if len(times) > 1:
        last_duration = times[-1] - times[-2]
    else:
        last_duration = times[0]
    return np.append(np.diff(times), last_duration)

def quantize_durations(durations, tempo):
    beat_duration = 60 / tempo
    quantized = []
    for d in durations:
        beats = d / beat_duration
        if   beats >= 1.5: quantized.append(1)
        elif beats >= 1.0: quantized.append(2)
        elif beats >= 0.5: quantized.append(4)
        elif beats >= 0.25: quantized.append(8)
        else: quantized.append(16)
    return quantized

def group_notes(midi_notes, durations):
    grouped_melody, grouped_durations = [], []
    current = midi_notes[0]
    cur_dur = durations[0]
    for note, dur in zip(midi_notes[1:], durations[1:]):
        if note == current:
            cur_dur += dur
        else:
            grouped_melody.append(current)
            grouped_durations.append(cur_dur)
            current = note
            cur_dur = dur
    grouped_melody.append(current)
    grouped_durations.append(cur_dur)
    return grouped_melody, grouped_durations

def limit_size(melody, durations, max_size, method):
    if max_size is None or len(melody) <= max_size:
        return melody, durations
    if method == 'truncate':
        return melody[:max_size], durations[:max_size]
    factor = len(melody) / max_size
    idx = [int(i * factor) for i in range(max_size)]
    return [melody[i] for i in idx], [durations[i] for i in idx]

def process(file_path, tempo, max_size, method, label):
    pitches, times = extract_pitches(file_path)
    if len(pitches) == 0:
        print(f"// {label}: sem pitches detectados")
        return
    midi_notes = [frequency_to_midi_note(f) for f in pitches]
    durs = calculate_durations(times)
    gmel, gdur = group_notes(midi_notes, durs)
    qdur = quantize_durations(gdur, tempo)
    lmel, ldur = limit_size(gmel, qdur, max_size, method)
    consts = ', '.join(midi_note_to_arduino_constant(n) for n in lmel)
    durs_s = ', '.join(str(int(d)) for d in ldur)
    print(f"// === {label}: {len(lmel)} notes ===")
    print(f"int melody_{label}[] = {{ {consts} }};")
    print(f"int durations_{label}[] = {{ {durs_s} }};")
    print()

def main():
    if len(sys.argv) < 2:
        print("Uso: python audio_to_arduino.py <input.wav|mp3> [opções]")
        return
    input_file = sys.argv[1]
    tempo = 120
    max_size = None
    method = 'truncate'
    label = os.path.splitext(os.path.basename(input_file))[0]
    args = sys.argv[2:]
    i = 0
    while i < len(args):
        if args[i] == '--tempo': i += 1; tempo = float(args[i])
        elif args[i] == '--max-size': i += 1; max_size = int(args[i])
        elif args[i] == '--method': i += 1; method = args[i]
        elif args[i] == '--label': i += 1; label = args[i]
        i += 1
    process(input_file, tempo, max_size, method, label)

if __name__ == '__main__':
    main()
