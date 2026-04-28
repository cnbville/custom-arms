import { blocks } from './blocks'
import { RPE_DATA, TECHNIQUE_GLOSSARY, TEMPO_GUIDE } from './constants'

describe('blocks', () => {
  it('has 7 blocks A–G', () => {
    expect(blocks).toHaveLength(7)
    expect(blocks.map(b => b.id)).toEqual(['A','B','C','D','E','F','G'])
  })
  it('every block has accent color', () => {
    blocks.forEach(b => expect(b.accent).toMatch(/^#/))
  })
})

describe('constants', () => {
  it('RPE_DATA has 4 entries', () => {
    expect(RPE_DATA).toHaveLength(4)
  })
  it('TECHNIQUE_GLOSSARY has 6 entries', () => {
    expect(TECHNIQUE_GLOSSARY).toHaveLength(6)
  })
  it('TEMPO_GUIDE explains X-Y-Z format', () => {
    expect(TEMPO_GUIDE.format).toContain('Eccentric')
  })
})
