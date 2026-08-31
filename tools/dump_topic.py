"""Print a topic's questions for translation review: python tools/dump_topic.py sql"""
import json, sys
d = json.load(open('data/questions.json', encoding='utf-8'))
tid = sys.argv[1]
for q in d['questions']:
    if q['t'] != tid:
        continue
    print(f"{q['id']}|Q|{q['qe']}")
    print(f"{q['id']}|A|{q['ae']}")
