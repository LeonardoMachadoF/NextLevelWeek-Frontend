import Image from 'next/image';
import appPreviewImg from '../assets/aplicacao-trilha-ignite.png'
import logoImg from '../assets/logo.svg'
import usersAvatarExampleImages from '../assets/avatares.png'
import iconCheckImage from '../assets/icon.svg'
import { api } from '../lib/axios';
import { FormEvent, useState } from 'react';

interface HomeProps {
    poolsCount: number;
    guessesCount: number;
    usersCountResponse: number;
}

export default function Home({ poolsCount, guessesCount, usersCountResponse }: HomeProps) {
    const [poolTitle, setPoolTitle] = useState('');

    async function createPool(event: FormEvent) {
        event.preventDefault();

        try {
            const response = await api.post('/pools', {
                title: poolTitle
            });

            const { code } = response.data;

            await navigator.clipboard.writeText(code);

            setPoolTitle('');
            alert('Bolão criado com sucesso e o código foi copiado para a area de transferencia!')
        } catch (err) {
            console.log(err);
            alert('Falha ao criar o bolão, tente novamente!');
        }
    }

    return (
        <div className='max-w-[1124px] h-screen mx-auto grid gap-28 grid-cols-2 items-center'>
            <main>
                <Image src={logoImg} alt='NLW Copa' />
                <h1 className='mt-14 text-white text-5xl font-bold leading-tight'>Crie seu próprio bolão da copa e compartilhe entre amigos!</h1>

                <div className='mt-10 flex items-center gap-2'>
                    <Image src={usersAvatarExampleImages} alt='' />
                    <strong className='text-gray-100 text-xl'>
                        <span className='text-ignite-500'>+{usersCountResponse}</span> pessoas já estão usando
                    </strong>
                </div>

                <form onSubmit={createPool} className='mt-10 flex gap-2'>
                    <input
                        type="text"
                        required
                        placeholder='Qual nome do seu bolão?'
                        className='flex-1 px-6 py-4 rounded bg-gray-800 border border-gray-600 text-sm text-gray-100'
                        onChange={e => setPoolTitle(e.target.value)}
                        value={poolTitle}
                    />
                    <button
                        type='submit'
                        className='bg-yellow-500 px-6 py-4 rounded text-gray-900 font-bold text-sm uppercase transition-colors hover:bg-yellow-700'
                    >
                        Criar meu bolão
                    </button>
                </form>

                <p className='mt-4 text-sm text-gray-300 leading-relaxed'>
                    Após criar seu bolão, você receberá um código único que poderá usar para convidar outras pessoas 🚀
                </p>

                <div className='mt-10 pt-10 border-t border-gray-600 flex items-center justify-between text-gray-100'>
                    <div className='flex items-center gap-6'>
                        <Image src={iconCheckImage} alt='' />
                        <div className='flex flex-col'>
                            <span className='font-bold text-2xl'>+{poolsCount}</span>
                            <span>Bolões criados</span>
                        </div>
                    </div>

                    <div className='w-px h-14 bg-gray-600'></div>

                    <div className='flex items-center gap-6'>
                        <Image src={iconCheckImage} alt='' />
                        <div className='flex flex-col'>
                            <span className='font-bold text-2xl'>+{guessesCount}</span>
                            <span>Palpites enviados</span>
                        </div>
                    </div>
                </div>
            </main>

            <Image
                src={appPreviewImg}
                alt="Dois celulares exibindo uma previa da aplicação do NLW copa!"
                quality={100}
            />
        </div>
    )
};

export const getStaticProps = async () => {
    const [poolsCountResponse, guessesCountResponse, usersCountResponse] = await Promise.all([
        api.get('pools/count'),
        api.get('guesses/count'),
        api.get('users/count')
    ]);

    return {
        props: {
            poolsCount: poolsCountResponse.data.count,
            guessesCount: guessesCountResponse.data.count,
            usersCountResponse: usersCountResponse.data.count
        },
        revalidate: 60 * 10
    }
}
