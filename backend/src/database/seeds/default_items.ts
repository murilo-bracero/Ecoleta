import Knex from "knex";

export async function seed (knex: Knex) {
    await knex('items').insert([
        { title: 'Lâmpadas', image: 'lamp.svg' },
        { title: 'Pilhas e Baterias', image: 'battery.svg' },
        { title: 'Papéis e Papelão', image: 'papers-n-cardboards.svg' },
        { title: 'Resíduos Eletrônicos', image: 'eletronics.svg' },
        { title: 'Resíduos Orgânicos', image: 'organic.svg' },
        { title: 'Óleo de Cozinha', image: 'oil.svg' }
    ])
}