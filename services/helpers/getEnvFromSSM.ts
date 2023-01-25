import { SSM } from 'aws-sdk'

export const getParamFromSSM = async (paramName: string) => {
  const { REGION, STAGE, NAME } = process.env
  const ssm = new SSM({ region: REGION })

  const { Parameter } = await ssm
    .getParameter({
      Name: `/${NAME}/${STAGE}/${paramName}`,
    })
    .promise()

  if (!Parameter) throw new Error('Parameter not found')

  return Parameter.Value
}

export const getMultipleParamsFromSSM = async (
  paramNames: string[],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> => {
  const { REGION, STAGE, NAME } = process.env
  const ssm = new SSM({ region: REGION })

  let paramList = {}

  await Promise.all(
    paramNames.map(async (param, index) => {
      const { Parameter } = await ssm
        .getParameter({
          Name: `/${NAME}/${STAGE}/${param}`,
        })
        .promise()

      if (!Parameter)
        throw new Error(`Parameter N°${index}: ${param} not found`)
      paramList = { ...paramList, [param.replace('-', '_')]: Parameter.Value }

      return { [param.replace('-', '_')]: Parameter.Value }
    }),
  )

  return paramList
}
