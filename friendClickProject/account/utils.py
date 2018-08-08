class Ranking(object):
    name = ""
    rank = 0

def getAccountRank(points):
	ranking = Ranking()
	if 0 <= points <= 999:
		ranking.rank = 1
		ranking.name = 'Rookie'
		ranking.progress = (points / 999) * 100
	elif 1000 <= points <= 9999:
		ranking.rank = 2
		ranking.name = 'Pro'
		ranking.progress = (points / 9999) * 100
	elif 10000 <= points <= 24999:
		ranking.rank = 3
		ranking.name = 'Veteran'
		ranking.progress = (points / 24999) * 100
	elif 25000 <= points <= 49999:
		ranking.rank = 4
		ranking.name = 'Expert'
		ranking.progress = (points / 49999) * 100
	elif 50000 <= points <= 99999:
		ranking.rank = 5
		ranking.name = 'Master'
		ranking.progress = (points / 99999) * 100
	elif 100000 <= points:
		ranking.rank = 6
		ranking.name = 'Legend'
		ranking.progress = 100
	return ranking