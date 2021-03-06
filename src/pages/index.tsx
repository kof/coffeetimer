import React, { useEffect } from 'react';
import { NextPage } from 'next';
import { useMachine } from '@xstate/react';
import { Box, Flex, VisuallyHidden } from 'tamia';
import { App } from '../components/App';
import { TheButton } from '../components/TheButton';
import { WaterSlider } from '../components/WaterSlider';
import { Ingredients } from '../components/Ingredients';
import { Steps, Step } from '../components/Steps';
import { timerMachine } from '../machines/timerMachine';
import { preset } from '../presets/default';

const IndexPage: NextPage = () => {
	const { waterFrom, waterTo, waterDefault, brew } = preset;
	const [
		{
			context: { waterAmount, elapsed },
			value: status,
		},
		send,
	] = useMachine(timerMachine);
	const { timer, coffeeAmount, steps } = brew({ waterAmout: waterAmount });

	useEffect(() => {
		send('UPDATE_WATER_AMOUNT', { value: waterDefault });
	}, [waterDefault]);

	useEffect(() => {
		send('UPDATE_DURATION', { value: timer });
	}, [timer]);

	return (
		<App>
			<VisuallyHidden as="h1">Coffee timer</VisuallyHidden>
			<Flex flexDirection="column" gap="l" mt="m">
				<Box>
					<WaterSlider
						min={waterFrom}
						max={waterTo}
						value={waterAmount}
						step={10}
						disabled={status === 'running'}
						onChange={value => {
							send('UPDATE_WATER_AMOUNT', {
								value,
							});
						}}
					/>
				</Box>
				<Box>
					<Flex justifyContent="center">
						<TheButton
							status={status === 'running' ? 'running' : 'paused'}
							duration={timer}
							elapsed={elapsed}
							onStart={() => send('TOGGLE')}
							onReset={() => send('TOGGLE')}
						/>
					</Flex>
				</Box>
				<Box>
					<Ingredients waterAmount={waterAmount} coffeeAmount={coffeeAmount} />
				</Box>
				<Box>
					<Flex as={Steps} flexDirection="column" gap="s">
						{steps.map((step, index) => (
							<Step key={index}>{step}</Step>
						))}
					</Flex>
				</Box>
			</Flex>
		</App>
	);
};

export default IndexPage;
