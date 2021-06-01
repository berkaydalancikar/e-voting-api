const userStatuses = Object.freeze({
  ACTIVE: 'active',
  PASSIVE: 'passive'
})

const electionProgress = Object.freeze({
  IDLE: 'idle',
  PRE_ELECTION: 'pre-election',
  PERI_ELECTION: 'peri-election',
  POST_ELECTION: 'post-election'
})

const voteStatus = Object.freeze({
  YES: 'yes',
  NO: 'no'
})

module.exports = {
  userStatuses,
  electionProgress,
  voteStatus
}
