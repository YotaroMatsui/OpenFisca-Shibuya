"""
児童扶養手当の実装
"""

import numpy as np
from openfisca_core.periods import MONTH, DAY
from openfisca_core.variables import Variable
from openfisca_japan.entities import 世帯


class 児童扶養手当(Variable):
    value_type = float
    entity = 世帯
    definition_period = DAY
    label = "保護者への児童扶養手当"
    reference = "https://www.city.shibuya.tokyo.jp/kodomo/teate/hitorioya/hitorioya_teate.html"
    documentation = """
    渋谷区の児童扶養手当制度

    - 〒150-8010 東京都渋谷区宇田川町1-1
    - 渋谷区子ども青少年課子育て給付係
    - 03-3463-2558
    """

    def formula(対象世帯, 対象期間, parameters):
        児童扶養手当 = parameters(対象期間).福祉.育児.児童扶養手当

        # 世帯で最も高い所得の人が基準となる
        世帯高所得 = 対象世帯("世帯高所得", 対象期間)

        扶養人数 = 対象世帯("扶養人数", 対象期間)[0]

        # 所得が全部支給所得制限限度額よりも高かったら一部支給になる
        全部支給所得制限限度額 = 児童扶養手当.所得制限限度額.全部支給[扶養人数]
        全部支給所得条件 = 世帯高所得 < 全部支給所得制限限度額
        # 所得が一部支給所得制限限度額よりも高かったら支給なしになる
        一部支給所得制限限度額 = 児童扶養手当.所得制限限度額.一部支給[扶養人数]
        一部支給所得条件 = 世帯高所得 < 一部支給所得制限限度額

        ひとり親世帯である = 対象世帯.nb_persons(世帯.保護者) == 1
        学年 = 対象世帯.members("学年", 対象期間)
        上限学年以下の人数 = 対象世帯.sum(学年 <= 児童扶養手当.上限学年)

        手当条件 = ひとり親世帯である * 全部支給所得条件
        # 児童の人数に応じて手当金額を変える
        # TODO: 一部支給の場合に対応する。(手当額の算出方法不明)
        # TODO: 公的年金額が児童扶養手当額より低い場合はその差額を児童扶養手当として受け取れる
        # 参考：https://www.city.shibuya.tokyo.jp/kodomo/teate/hitorioya/heikyu.html
        手当金額 = \
            np.sum(
                + ((上限学年以下の人数 == 1) * 児童扶養手当.金額.全部支給.児童1人)
                + ((上限学年以下の人数 == 2) * (児童扶養手当.金額.全部支給.児童1人 + 児童扶養手当.金額.全部支給.児童2人))
                + ((上限学年以下の人数 > 2) * (児童扶養手当.金額.全部支給.児童1人 + 児童扶養手当.金額.全部支給.児童2人 \
                    + (児童扶養手当.金額.全部支給.児童3人以上 * (上限学年以下の人数 - 2)))),
                )

        return 手当条件 * 手当金額
