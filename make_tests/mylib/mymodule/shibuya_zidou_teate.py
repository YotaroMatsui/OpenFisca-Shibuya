# -*- coding: utf-8 -*-
import os
import sys
sys.path.append(os.curdir)
from .process_base import ProcessBase

# 渋谷区児童手当
class Process(ProcessBase):
    def __init__(self, outfile, period, titles, infile):
        super().__init__(outfile, period, titles, infile)

        # 入力と出力の関係性定義
        self.children = {
            '第1子誕生年月日': '2023-4 第1子年齢',
            '第2子誕生年月日': '2023-4 第2子年齢',
            '第3子誕生年月日': '2023-4 第3子年齢',
        }
        for c in self.children.values():
            self.dict_titles[c] = c.replace('2023-4 ', '')
        # OpenFisca では出力変数名がシステム上一意である必要があると思われる
        # そのため、「支給額」を「児童手当支給額」に変換する
        self.dict_titles['支給額'] = '児童手当支給額'

    def process(self, row):
        # name
        self.lineout(1, 'name', 'テストID=' + row[self.titles['テストID']], flag = True, xlate = False)
        # period
        self.lineout(2, 'period', self.period, xlate = False)
        # input
        self.lineout(2, 'input', None, xlate = False)
        self.lineout(4, '扶養人数', row[self.titles['扶養人数']])
        self.lineout(4, '所得', row[self.titles['所得']].replace(',', ''))
        children = dict()
        for ck, cv in self.children.items():
            if row[self.titles[ck]]:
                self.lineout(4, ck, row[self.titles[ck]])
                children[cv] = row[self.titles[cv]]
        # output
        self.lineout(2, 'output', None, xlate = False)
        for ck, cv in children.items():
            self.lineout(4, ck, cv)
        self.lineout(4, '支給額', row[self.titles['支給額']].replace(',', ''))
        # separator
        self.outfile.write("\n")
