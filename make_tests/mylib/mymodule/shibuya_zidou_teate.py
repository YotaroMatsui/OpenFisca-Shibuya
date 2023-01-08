# -*- coding: utf-8 -*-
import os
import sys
sys.path.append(os.curdir)
from .process_base import ProcessBase
import yaml

# 渋谷区児童手当
class Process(ProcessBase):
    def __init__(self, period, titles):
        super().__init__(period, titles)

        # 入力と出力の関係性定義
        self.parents = [ '太郎' ]
        self.persons = [ '一郎', '二郎', '三郎', '四郎', '五郎', '六郎', '七郎', '八郎', '九郎' ]
        self.children = {
            self.persons[0]: '2023-4 第1子年齢',
            self.persons[1]: '2023-4 第2子年齢',
            self.persons[2]: '2023-4 第3子年齢',
        }
        self.dict_titles[self.persons[0]] = '第1子誕生年月日'
        self.dict_titles[self.persons[1]] = '第2子誕生年月日'
        self.dict_titles[self.persons[2]] = '第3子誕生年月日'

        # OpenFisca では出力変数名がシステム上一意である必要があると思われる
        # そのため、「支給額」を「児童手当」に変換する
        self.dict_titles['支給額'] = '児童手当'

    def age2birthday(self, age):
        pr = self.period.split('-')
        pr[0] = int(pr[0]) - age
        pr[1] = int(pr[1]) - 1
        if pr[1] < 1:
            pr[0] -= 1
            pr[1] = 12
        bd = list()
        bd.append('%04d' % pr[0])
        bd.append('%02d' % pr[1])
        return '-'.join(bd)

    def process(self, row):
        res = super().process(row)
        d_input = dict()
        d_output = dict()
        num_total = int(row[self.titles['扶養人数']])

        # input
        d_input['世帯'] = dict()
        d_input['世帯']['保護者一覧'] = [ '太郎' ]
        in_children = dict()
        out_children = dict()
        num_huyou = 0
        for ck, cv in self.children.items():
            if row[self.titles[self.dict_titles[ck]]]:
                num_huyou += 1
                num_total += 1
                in_children[ck] = { '誕生年月日': self.age2birthday(int(row[self.titles[cv]])) }
                out_children[ck] = { '年齢': { self.period: int(row[self.titles[cv]]) } }
        
        adult = self.create_adult()
        for i in range(num_huyou, num_total):
            in_children[self.persons[i]] = { '誕生年月日' : adult[0] }
            out_children[self.persons[i]] = { '年齢': { self.period: adult[1] } }
        if num_total > 0:
            d_input['世帯']['児童一覧'] = self.persons[0:num_total]
        d_input['世帯員'] = { '太郎': { '所得': { self.period: int(row[self.titles['所得']].replace(',', '')) } } }
        for ck, cv in in_children.items():
            d_input['世帯員'][ck] = in_children[ck]

        # output
        d_output['世帯員'] = out_children
        d_output['世帯'] = { self.dict_titles['支給額']: { self.period: int(row[self.titles['支給額']].replace(',', '')) } }
        res['input'] = d_input
        res['output'] = d_output
        return res
